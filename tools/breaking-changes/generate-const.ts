import * as fs from 'fs';
import stringifyObject from 'stringify-object';
const { execSync } = require('child_process');

/**
 * This script generated the constructor deprecation schematics entries.
 *
 * Input: A breaking changes file, likely `./data/breaking-changes.json`
 * Output: A file, `generate-const.out.ts`, that contains a ConstructorDeprecation[] array to paste over in the migration schematics code.
 *
 * Some use cases need a manual review/fixing after the generation.
 *
 * - params renamed + other legit braking changs (renamed params will be present as breaking changes in in both added params and removed params)
 * - params with anonymous types, like: `someParam: { customerId: string, cart:Cart }`
 * - deleted constructor (support for this could be added in the future)
 *
 * How to spot the cases for manual review:
 * - look for empty import paths in the generated code.  Search for [importPath: '']
 * - look for `warning:` occurences in the generated code.  Search for [warning:]
 * - look for CONSTRUCTOR_DELETED occurences in the braking change list
 *
 */

/**
 * -----------
 * Main logic
 * -----------
 */

const breakingChangesFile = process.argv[2];

const breakingChangesData = JSON.parse(
  fs.readFileSync(breakingChangesFile, 'utf-8')
);

console.log(
  `Read: ${breakingChangesFile}, ${breakingChangesData.length} entries`
);

let ticketCount = 0;

const constructorSchematics = [];
for (let index = 0; index < breakingChangesData.length; index++) {
  const apiElement = breakingChangesData[index];
  const constructorChanges = getConstructorChanges(apiElement);
  if (constructorChanges) {
    ticketCount++;
    //logWarnings(apiElement, constructorChanges);
    constructorSchematics.push(
      getSchematicsData(apiElement, constructorChanges)
    );
  }
}
console.log(`Generated ${ticketCount} entries.`);
fs.writeFileSync(
  `generate-const.out.ts`,
  stringifyObject(constructorSchematics)
);

/**
 * -----------
 * Functions
 * -----------
 */

function getConstructorChanges(apiElement: any): any {
  return apiElement.breakingChanges.find((breakingChange: any) => {
    return breakingChange.change === 'CONSTRUCTOR_CHANGED';
  });
}

function getSchematicsData(apiElement: any, constructorChanges: any): any {
  const schematicsData: any = {};
  schematicsData.class = apiElement.name;
  schematicsData.importPath = apiElement.entryPoint;
  schematicsData.deprecatedParams =
    constructorChanges.details.oldParams.map(toSchematicsParam);
  schematicsData.removeParams =
    constructorChanges.details.oldParams.map(toSchematicsParam);
  schematicsData.addParams =
    constructorChanges.details.newParams.map(toSchematicsParam);

  return schematicsData;
}

function toSchematicsParam(param: any) {
  return {
    className: param.shortType || param.type,
    importPath: param.importPath,
  };
}
