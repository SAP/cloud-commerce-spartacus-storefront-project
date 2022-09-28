# Pre-push checklist

- [ ] `yarn install`
- [ ] `./ci-scripts/prepend-license.sh`
- [ ] `yarn config:check`
- [ ] `yarn prettier:fix`
- [ ] `yarn lint:styles`
- [ ] `yarn i18n-lint`
- [ ] `ng lint pickup-in-store`
- [ ] `yarn build:libs`
- [ ] `yarn build`
- [ ] `ng test pickup-in-store --source-map --watch=false --code-coverage --browsers=ChromeHeadless`
- [ ] `./ci-scripts/lhci.sh` (warning: slow, ~12 minutes)
- [ ] If schematics have been updated: `yarn --cwd feature-libs/pickup-in-store run test:schematics --coverage=true`

## `./ci-scripts/prepend-license.sh` prerequisites

1. Install pipx - <https://pypa.github.io/pipx/>
2. Install reuse - `pipx install reuse` (<https://github.com/fsfe/reuse-tool>)

## Unit Tests

If we have changed other feature libraries we should run the unit tests for those in a similar fashion. i.e. `ng test <library>` etc.

## Other useful commands

- `yarn generate:deps`
- `yarn config:update`
- `yarn config:update --bump-version`
- `yarn --cwd feature-libs/pickup-in-store run test:schematics --coverage=true` (schematics unit tests)
