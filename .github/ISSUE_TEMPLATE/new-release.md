---
name: New Release
about: Checklist for new release
title: 'New Release: x.y.z'
labels: release-activities
assignees: ''

---

- [ ] Validate that all merged tickets were tested (QA column must be empty, except for tickets marked as `not-blocking-release`)
- [ ] Create new maintenance branch `release/x.y.z`
- [ ] Announce new maintenance branch (Set topic in tribe channel)
- [ ] Create release branch `release/x.y.z` from the corresponding branch (develop/maintenance)
- [ ] [Bump versions for schematics migration](https://github.com/SAP/spartacus/blob/develop/projects/schematics/README.md#releasing-update-schematics)
- [ ] Run all e2e tests on release branch (Pro tip: run mobile, regression, smoke scripts in parallel to get all the results faster, after that retry failed tests in open mode)
- [ ] Build app on this branch using [this script](https://github.tools.sap/cx-commerce/spartacus-installation). (Use the following `config.sh`):

  ```bash
  BACKEND_URL="https://dev-com-17.accdemo.b2c.ydev.hybris.com:9002"
  BRANCH='release/x.y.z'
  SPARTACUS_VERSION='x.y.z'
  ```

  Using the [new installation script](https://github.com/SAP/spartacus/pull/7433) (located in `scripts/install`, not merged yet), please perform below steps:

  - [ ] Run `./run.sh install`
  - [ ] You can then go to each app directory and run it with yarn build, start, build:ssr etc.

- [ ]  make are sure that release branch is working correctly, everything is passing and it builds

---

For Mac:

- [ ] Cleanup repo, build and generate compodocs and publish on github pages, generate spartacussampleaddon archives (`./scripts/pre-release.sh`)

For Windows:

- [ ] Cleanup repo, build and generate compodocs and publish on github pages (`yarn generate:docs` and `yarn publish:docs` for patch stable/releases)
- [ ] Download and rename in root directory `https://github.tools.sap/cx-commerce/spartacussampledataaddon/archive/develop.zip` -> `spartacussampledataaddon.zip`
- [ ] Download and rename in root directory `https://github.tools.sap/cx-commerce/spartacussampledataaddon/archive/develop.tar.gz` -> `spartacussampledataaddon.tar.gz`

---

- [ ] Release libraries with release-it scripts (set GITHUB_TOKEN env variable, check if you are loggin in with `npm whoami` (if not logged, then login with `npm login`); for each package select/type version when prompted):
  - [ ] `npm run release:assets:with-changelog`
  - [ ] `npm run release:styles:with-changelog`
  - [ ] `npm run release:lib:with-changelog`
  - [ ] `npm run release:core:with-changelog`
  - [ ] `npm run release:cds:with-changelog`
  - [ ] `npm run release:schematics:with-changelog`
- [ ] Check that release-notes are populated on github (if not, update them)
- [ ] Check tags on npm (`next` tag should always point to the highest version, `latest` for the last stable verion, you can leave `rc` tag until we release stable release). Use `npm dist-tag` for updates.
- [ ] Check libs from a new shell app (install-script) `./run.sh install_npm` (run the script from `scripts/install` directory and change config's `SPARTACUS_VERSION` to `next/latest`)
- [ ]  merge release branch (PR from release/x.y.z) to maintenance branch
- [ ]  inform PO about libraries successfully released
- [ ]  Announce the new release on tribe channel
