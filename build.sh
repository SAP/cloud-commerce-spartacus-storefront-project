#!/usr/bin/env bash
set -e
set -o pipefail

function validatestyles {
    echo "-----"
    echo "Validating styles app"
    pushd projects/storefrontstyles
    yarn
    yarn sass
    rm -rf temp-scss
    popd
}

function validateTsConfigFile {
    echo "Validating ${TSCONFIGFILE_TO_VALIDATE} integrity"
    LOCAL_ENV_LIB_PATH_OCCURENCES=$(grep -c "projects/storefrontlib/src/public_api" ${TSCONFIGFILE_TO_VALIDATE} || true)
    if [ $LOCAL_ENV_LIB_PATH_OCCURENCES \> 0 ];
    then
        echo "ERROR: ${TSCONFIGFILE_TO_VALIDATE} file is invalid. Found [${LOCAL_ENV_LIB_PATH}].";
        echo "A proper ng-packager build in /dist should be used in this context."
        exit 1
    else
        echo "${TSCONFIGFILE_TO_VALIDATE} file is valid.";
    fi;
}

LOCAL_ENV_LIB_PATH="projects/storefrontlib/src/public_api"
TSCONFIGFILE_TO_VALIDATE="projects/storefrontapp/tsconfig.app.prod.json"
validateTsConfigFile
TSCONFIGFILE_TO_VALIDATE="projects/storefrontapp-e2e/tsconfig.e2e.json"
validateTsConfigFile

echo "Validating that no 'fdescribe' occurrences are present in tests..."
results=$(grep -rl --include "*.spec.ts" fdescribe projects || true)
if [[ -z "$results" ]]; then
    echo "Success: No 'fdescribe' occurrences detected in tests."
else
    echo "ERROR: Detected 'fdescribe' occurrence(s) in these files:"
    echo "$results"
    exit 1
fi

echo "Validating that the storefrontlib does not import itself."
results=$(grep -rl --include "*.ts" "from 'storefrontlib'" projects/storefrontlib || true)
if [[ -z "$results" ]]; then
    echo "Success: storefrontlib does not seem to import itself."
else
    echo "ERROR: Detected occurrence(s) where storefronlib imports itself in these files:"
    echo "$results"
    exit 1
fi

echo "Starting pipeline for Spartacus project"
echo "-----"
echo "Updating dependencies"
yarn
echo "-----"
echo "Validating code linting"
ng lint
echo "-----"
echo "Validating code formatting (using prettier)"
./node_modules/.bin/prettier --config ./.prettierrc --list-different "projects/**/*{.ts,.js,.json,.scss}" 2>&1 |  tee prettier.log
results=$(tail -1 prettier.log | grep projects || true)
if [[ -z "$results" ]]; then
    echo "Success: Codebase has been prettified correctly"
    rm prettier.log
else
    echo "ERROR: Codebase not prettified. Aborting pipeline. Please format your code"
    rm prettier.log
    exit 1
fi

validatestyles

echo "-----"
echo "Running unit tests and code coverage for core lib"
exec 5>&1
output=$(ng test storefrontlib --watch=false --code-coverage --browsers=ChromeHeadless | tee /dev/fd/5)
coverage=$(echo $output | grep -i "does not meet global threshold" || true)
if [[ -n "$coverage" ]]; then
    echo "Error: Tests did not meet coverage expectations"
    exit 1
fi

echo "-----"
echo "Building SPA core lib"
yarn build:core:lib
echo "-----"
echo "Building SPA app"
yarn build
echo "-----"
echo "Running end to end tests"
yarn e2e:ci
echo "-----"
echo "Spartacus Pipeline completed"
