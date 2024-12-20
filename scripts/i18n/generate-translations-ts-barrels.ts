/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface TranslationFile {
  name: string;
  importPath: string;
}

interface ModifiedFiles {
  indexFiles: Set<string>;
  translationFiles: Set<string>;
}

function findTranslationDirs(): string[] {
  const translationDirs = glob.sync('**/assets/{,src/}translations', {
    ignore: ['**/node_modules/**', '**/dist/**'],
  });
  return translationDirs;
}

function getLanguageDirs(translationDir: string): string[] {
  return fs
    .readdirSync(translationDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function getJsonFiles(languageDir: string): TranslationFile[] {
  const jsonFiles = glob.sync('*.json', { cwd: languageDir });
  return jsonFiles.map((file) => ({
    name: path.basename(file, '.json'),
    importPath: `./${file}`,
  }));
}

function getLicenseHeader(): string {
  const currentYear = new Date().getFullYear();
  return `/*
 * SPDX-FileCopyrightText: ${currentYear} SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */\n\n`;
}

function getPrefix(translationDir: string): string | undefined {
  const configPath = path.join(
    translationDir,
    'generate-translations-ts-barrels.config'
  );
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf-8');
    const match = content.match(/PUBLIC_API_PREFIX=(.+)/);
    return match ? match[1].trim() : undefined;
  } else {
    throw new Error(
      `No generate-translations-ts-barrels.config file found in ${translationDir}`
    );
  }
}

function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function generateLanguageIndex(
  languageDir: string,
  translationFiles: TranslationFile[],
  modifiedFiles: ModifiedFiles
): void {
  const imports = translationFiles
    .map((file) => {
      const importName = kebabToCamelCase(file.name);
      return `import ${importName} from '${file.importPath}';`;
    })
    .join('\n');

  const exportObject = `\nexport const ${path.basename(
    languageDir
  )} = {\n${translationFiles
    .map((file) => `  ${kebabToCamelCase(file.name)},`)
    .join('\n')}\n};\n`;

  const indexContent = getLicenseHeader() + imports + exportObject;
  const indexPath = path.join(languageDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  modifiedFiles.indexFiles.add(indexPath);
}

function generateMainTranslations(
  translationDir: string,
  languages: string[],
  modifiedFiles: ModifiedFiles
): void {
  const prefix = getPrefix(translationDir);

  const languageExports = languages
    .map((lang) => {
      const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
      const exportName = prefix
        ? `${prefix}Translations${capitalizedLang}`
        : `translations${capitalizedLang}`;
      return `export { ${lang} as ${exportName} } from './${lang}/index';`;
    })
    .join('\n');

  const chunksConfigName = prefix
    ? `${prefix}TranslationChunksConfig`
    : 'translationChunksConfig';
  const deprecatedExport = `import { en } from './en/index';
import { extractTranslationChunksConfig } from '@spartacus/core';
export const ${chunksConfigName} = extractTranslationChunksConfig(en);`;

  const translationsPath = path.join(translationDir, 'translations.ts');
  fs.writeFileSync(
    translationsPath,
    getLicenseHeader() + deprecatedExport + '\n\n' + languageExports + '\n'
  );
  modifiedFiles.translationFiles.add(translationsPath);
}

function processTranslationDir(
  translationDir: string,
  modifiedFiles: ModifiedFiles
): void {
  console.log(`Processing translation directory: ${translationDir}`);

  const languages = getLanguageDirs(translationDir);

  for (const lang of languages) {
    const langDir = path.join(translationDir, lang);
    const translationFiles = getJsonFiles(langDir);
    generateLanguageIndex(langDir, translationFiles, modifiedFiles);
  }

  generateMainTranslations(translationDir, languages, modifiedFiles);
}

async function main(): Promise<void> {
  const translationDirs = findTranslationDirs();

  if (translationDirs.length === 0) {
    console.log('No translation directories found');
    return;
  }

  console.log('Processing translation directories...\n');

  const modifiedFiles: ModifiedFiles = {
    indexFiles: new Set<string>(),
    translationFiles: new Set<string>(),
  };

  for (const dir of translationDirs) {
    processTranslationDir(dir, modifiedFiles);
  }

  // Run prettier on modified files
  const allModifiedFiles = [
    ...modifiedFiles.indexFiles,
    ...modifiedFiles.translationFiles,
  ];
  if (allModifiedFiles.length > 0) {
    console.log('\nRunning prettier on modified files...');
    const { exec } = require('child_process');
    // const filePaths = allModifiedFiles.join(',');

    try {
      await new Promise((resolve, reject) => {
        exec(
          // `prettier --config ./.prettierrc --write --list-different "${filePaths}"`
          // `npm run prettier:fix`,
          'echo "done"',
          (error: Error | null) => {
            if (error) {
              reject(error);
            } else {
              resolve(undefined);
            }
          }
        );
      });
      console.log('Prettier formatting complete.');
    } catch (error) {
      console.error('Error running prettier:', error);
    }

    // SPIKE TODO REMOVE:
    console.log(
      'SPIKE TODO ADD RUNNING PRETTIER - but only on the changed files'
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
