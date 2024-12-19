const { ipcMain } = require('electron');

const ipcGeneral = {
    devToolsToggle: function (win) {
        ipcMain.handle('devTools:toggle', () => {
            if (win.webContents.isDevToolsOpened()) {
                win.webContents.closeDevTools();
                return 'closeDevTools';
            }
            win.webContents.openDevTools();
            return 'openDevTools';
        });
    },
    navigationHandler: function (win, pathViews) {
        ipcMain.on('navTo', (e, view) => {
            if (view === 'home') {
                win.loadFile(pathViews.home);
            } else if (view === 'addCred') {
                win.loadFile(pathViews.addCred);
            } else {
                return;
            }
            // } else if (view === 'settings') {
            //     win.loadFile(pathViews.settings);
            // } else {
            //     return;
            // }
        });
    },

};

module.exports = ipcGeneral;