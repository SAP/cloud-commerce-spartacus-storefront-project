#!/usr/bin/env bash
set -o errexit
set -o nounset

APP="upp-cli"

echo "-----"
echo "Downloading upp cli zip"

curl -u ${GHT_USER}:${GHT_TOKEN} -L -H "Accept: application/octet-stream" \
    "https://github.tools.sap/api/v3/repos/cx-commerce/upscale-partner-platform-cli/releases/assets/7203" -o ${APP}.zip

if [ ! -s ${APP}.zip ]; then
    echo "Error downloading upp CLI zip. Check url and configs"
    exit 1
fi

echo "-----"
echo "Installing upp cli (dependencies)"
unzip -o ${APP}.zip -d ${APP}
cd ${APP}
npm install

echo "-----"
echo "Installing upp cli (npm-force-resolutions)"
sed -i '/preinstall/d' package.json
npx npm-force-resolutions

echo "-----"
echo "Installing upp cli (util)"
npm install -g

cd ..

echo "-----"
echo "Configuring cli"

upp config -z -t ${UPP_TENANT} -c ${UPP_CLIENT} -s ${UPP_SECRET} -r us10 -i 3 -a us10.stage.upp.upscalecommerce.com

echo "-----"
echo "Installing angular CLI"
npm install -g @angular/cli@~10.1.0

echo "-----"
echo "UPP CLI installed and ready."