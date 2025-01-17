const packager = require('electron-packager');
const path = require('node:path');

const packageDir = path.normalize('.');
const iconDir = path.resolve('./electron/assets/passGuardAIcon256.ico');
const options = {
    dir: packageDir,
    icon: iconDir,
    name: 'PassGuardA',
    arch: 'x64',
    platform: 'win32'
};

async function bundleElectronApp(options) {
  const appPaths = await packager(options)
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`)
}

(async function() {
    await bundleElectronApp(options);
})();