const exec = require('@actions/exec');
const github = require('@actions/github');
const core = require('@actions/core');
const glob = require('@actions/glob');
const io = require('@actions/io');
const cache = require('@actions/cache');
const fs = require('fs');
const diff = require('diff-lines');
const normalizeNewline = require('normalize-newline');

async function prepareRepositoryForApiExtractor(branch, baseCommit) {
  core.startGroup('Prepare branches for extractor');
  await exec.exec('sh', [
    './.github/api-extractor-action/prepare-repo-for-api-extractor.sh',
  ]);
  await exec.exec('sh', [
    './.github/api-extractor-action/prepare-repo-for-api-extractor.sh',
    branch,
    'branch-clone',
    baseCommit,
  ]);
  // We can parallel these builds, when schematics builds won't trigger yarn install
  await exec.exec('sh', ['./.github/api-extractor-action/build-libs.sh']);
  await exec.exec('sh', [
    './.github/api-extractor-action/build-libs.sh',
    'branch-clone',
  ]);
  core.endGroup();
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const gh = github.getOctokit(GITHUB_TOKEN);

  const context = github.context;

  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;

  const relatedPR = context.payload.pull_request;

  const issueNumber = relatedPR.number;
  const baseBranch = relatedPR.base.ref;
  const baseCommit = relatedPR.base.sha;
  const reportHeader = 'Public API changes';

  let globber = await glob.create(
    '.github/api-extractor-action/api-extractor.json',
    {}
  );
  const apiExtractorConfigPath = (await globber.glob())[0];

  await prepareRepositoryForApiExtractor(baseBranch, baseCommit);

  const Status = {
    Unknown: 'unknown',
    Success: 'success',
    Failed: 'failed',
  };

  let entryPoints = {};

  globber = await glob.create('dist/**/package.json', {});
  const files = await globber.glob();

  await Promise.all(
    files.map(async (path) => {
      // for (let path of files) {
      const packageContent = JSON.parse(fs.readFileSync(path, 'utf-8'));
      const name = packageContent.name;
      const newName = name.replace(/\//g, '_').replace(/\_/, '/');
      fs.writeFileSync(
        path,
        JSON.stringify({ ...packageContent, name: newName }, undefined, 2)
      );

      if (!entryPoints[name]) {
        entryPoints[name] = {
          name: name,
          head: { status: Status.Unknown },
          base: { status: Status.Unknown },
          file: `${newName.split('/')[1]}.api.md`,
        };
      }

      const directory = path.substring(0, path.length - `/package.json`.length);

      // Run api extractor for entrypoint
      await io.cp(apiExtractorConfigPath, directory);
      const options = {
        ignoreReturnCode: true,
        delay: 1000,
        silent: true,
      };
      let myError = [];
      let output = [];
      options.listeners = {
        errline: (line) => {
          myError.push(line);
          if (output.length < 20) {
            output.push(line);
          }
        },
        stdline: (line) => {
          output.push(line);
        },
      };
      console.log('Starting extraction for ' + name);
      const exitCode = await exec.exec(
        'sh',
        ['./.github/api-extractor-action/api-extractor.sh', directory],
        options
      );
      if (exitCode !== 0) {
        entryPoints[name].head.status = Status.Failed;
        entryPoints[name].head.errors = myError.filter((line) =>
          line.startsWith('ERROR: ')
        );
      } else {
        entryPoints[name].head.status = Status.Success;
      }
      core.startGroup(`API extractor for ${name}`);
      for (let line of output) {
        console.log(line + '\n');
      }
      // console.log(output);
      await wait(10000);
      core.endGroup();
    })
  );

  console.log('Finished running extractor for head branch!');

  globber = await glob.create('branch-clone/dist/**/package.json', {});
  const files2 = await globber.glob();

  core.startGroup('API extractor for target branch');
  await Promise.all(
    files2.map(async (path) => {
      const packageContent = JSON.parse(fs.readFileSync(path, 'utf-8'));
      const name = packageContent.name;
      const newName = name.replace(/\//g, '_').replace(/\_/, '/');
      fs.writeFileSync(
        path,
        JSON.stringify({ ...packageContent, name: newName }, undefined, 2)
      );

      if (!entryPoints[name]) {
        entryPoints[name] = {
          name: name,
          head: { status: Status.Unknown },
          base: { status: Status.Unknown },
          file: `${newName.split('/')[1]}.api.md`,
        };
      }

      const directory = path.substring(0, path.length - `/package.json`.length);

      await io.cp(apiExtractorConfigPath, directory);
      const options = {
        ignoreReturnCode: true,
        delay: 1000,
        silent: true,
      };
      let myError = [];
      let output = '';
      options.listeners = {
        errline: (line) => {
          myError.push(line);
        },
        stdout: (data) => {
          output += data.toString();
        },
        stderr: (data) => {
          output += data.toString();
        },
      };
      const exitCode = await exec.exec(
        'sh',
        ['./.github/api-extractor-action/api-extractor.sh', directory],
        options
      );
      if (exitCode !== 0) {
        entryPoints[name].base.status = Status.Failed;
        entryPoints[name].base.errors = myError.filter((line) =>
          line.startsWith('ERROR: ')
        );
      } else {
        entryPoints[name].base.status = Status.Success;
      }
      core.startGroup(name);
      console.log(output);
      core.endGroup();
    })
  );
  core.endGroup();

  let notAnalyzableEntryPoints = [];

  const comment = Object.values(entryPoints)
    .map((entry) => {
      if (
        entry.head.status === Status.Success &&
        entry.base.status === Status.Success
      ) {
        // prepare diff
        const diff = getDiff(entry.file);
        if (diff) {
          return `### ${entry.name}\n\`\`\`diff\n${diff}\n\`\`\``;
        }
        return '';
      } else if (
        entry.head.status === Status.Failed &&
        entry.base.status === Status.Success
      ) {
        return `### ${entry.name}
Library no longer can be analyzed with api-extractor. Please check the errors below\n
${entry.head.errors.join('\n')}`;
      } else if (
        entry.head.status === Status.Success &&
        entry.base.status === Status.Failed
      ) {
        return `### ${entry.name}\nLibrary can now by analyzed with api-extractor.`;
      } else if (
        entry.head.status === Status.Failed &&
        entry.base.status === Status.Failed
      ) {
        notAnalyzableEntryPoints.push(entry.name);
        if (entry.head.errors[0] !== entry.base.errors[0]) {
          return `### ${entry.name}\nNew error: \`${entry.head.errors[0]}\`\nPrevious error: \`${entry.base.errors[0]}\``;
        }
      } else if (entry.head.status === Status.Unknown) {
        return `### ${entry.name}\nEntry point removed. Are you sure it was intentional?`;
      } else if (entry.base.status === Status.Unknown) {
        const publicApi = extractSnippetFromFile(`etc/${entry.file}`);
        return `### ${entry.name}\nNew entry point. Initial public api:\n\`\`\`ts\n${publicApi}\n\`\`\``;
      }
      return '';
    })
    .filter((comment) => !!comment)
    .join('\n');

  function extractSnippetFromFile(filename) {
    const regexForTSSnippetInMarkdown = /```ts([\s\S]*)```/ms;
    return regexForTSSnippetInMarkdown
      .exec(normalizeNewline(fs.readFileSync(filename, 'utf-8')))[1]
      .trim();
  }

  function getDiff(file) {
    const sourceBranchReportDirectory = `etc`;
    const targetBranchReportDirectory = `branch-clone/etc`;
    const sourceBranchSnippet = extractSnippetFromFile(
      `${sourceBranchReportDirectory}/${file}`
    );
    const targetBranchSnippet = extractSnippetFromFile(
      `${targetBranchReportDirectory}/${file}`
    );
    return diff(targetBranchSnippet, sourceBranchSnippet, {
      n_surrounding: 3,
    });
  }

  function generateCommentBody(comment) {
    return '## ' + reportHeader + '\n' + comment.length
      ? comment
      : 'Nothing changed in analyzed entry points.' +
          '\n\n ### Impossible to analyze\n' +
          notAnalyzableEntryPoints.join('\n');
  }

  async function printReport(body) {
    const comments = await gh.issues.listComments({
      issue_number: issueNumber,
      owner,
      repo,
    });

    const botComment = comments.data.filter((comment) =>
      comment.body.includes(reportHeader)
    );

    if (botComment && botComment.length) {
      await gh.issues.updateComment({
        comment_id: botComment[0].id,
        owner,
        repo,
        body,
      });
    } else {
      await gh.issues.createComment({
        issue_number: issueNumber,
        owner,
        repo,
        body,
      });
    }
  }

  await printReport(generateCommentBody(comment));
}

run();
