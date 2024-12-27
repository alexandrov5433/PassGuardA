const { ipcMain } = require('electron');
const { getSettings } = require('../data/dataService.js');

const ipcSettings = {
    getSettingsHandler: function() {
        ipcMain.handle('getSettings', async (e, settingsType) => {
            try {
                return await getSettings(settingsType);
            } catch (err) {
                return err;
            }
        });
    }
};

module.exports = ipcSettings;