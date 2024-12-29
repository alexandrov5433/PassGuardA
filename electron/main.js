const __basename = __dirname;
module.exports = { __basename : __basename };

const { app, BrowserWindow } = require('electron/main');
const { pathPreloads } = require('./util/path');
const ipcUserAccount = require('./ipc/userAccount');
const ipcCredentials = require('./ipc/credentials');
const ipcSettings = require('./ipc/settings');


function createWindow() {
    const newWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: pathPreloads.preloadService
        }
    });
    newWindow.loadFile('dist/pass-guard-a/browser/index.html');
    newWindow.webContents.openDevTools();
    return newWindow;
}

function initHandlers() {
    ipcUserAccount.accountExists();
    ipcUserAccount.loginHandler();
    ipcUserAccount.registrationHandler();
    ipcUserAccount.logoutHandler();
    ipcUserAccount.deleteUserAccountHandler();
    
    ipcCredentials.generatePasswordHandler();
    ipcCredentials.credOverviewReqHandler();
    ipcCredentials.fetchPassPlainTextHandler();
    ipcCredentials.addCredentialsHandler();
    ipcCredentials.sendCorrectionForCredsByIdHandler();
    ipcCredentials.deleteCredsByIdHandler();

    ipcSettings.getSettingsHandler();
    ipcSettings.setSettingsHandler();
    ipcSettings.restoreDefaultSettingshandler();
    ipcSettings.getThemeStyleVariablesHandler();
}

app.whenReady().then(async () => {
    createWindow();
    initHandlers();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

