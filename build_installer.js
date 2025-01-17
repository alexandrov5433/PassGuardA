const { MSICreator } = require('electron-wix-msi');
const path = require('path');

const APP_DIR = path.resolve(__dirname, './PassGuardA-win32-x64');
const OUT_DIR = path.resolve(__dirname, './windows_installer');

const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    description: 'An offline desktop password manager.',
    exe: 'PassGuardA',
    name: 'PassGuardA',
    manufacturer: 'Alex',
    version: '1.0.0',
    icon: path.resolve('./electron/assets/passGuardAIcon256.ico'),

    ui: {
        chooseDirectory: true
    },
});

msiCreator.create().then(function(){
    msiCreator.compile();
});