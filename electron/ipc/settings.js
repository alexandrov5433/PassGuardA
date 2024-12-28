const { ipcMain } = require('electron');
const { getSettings, setSettings, restoreDefaultSettings } = require('../data/dataService.js');

const ipcSettings = {
    getSettingsHandler: function() {
        ipcMain.handle('getSettings', async (e, settingsType) => {
            try {
                return await getSettings(settingsType);
            } catch (err) {
                return err;
            }
        });
    },
    setSettingsHandler: function () {
        ipcMain.handle('setSettings', async (e, settingsType, settingsSubType, newSettingsObj) => {
            try {
                return await setSettings(settingsType, settingsSubType, newSettingsObj);
            } catch (err) {
                return err;
            }
        });
    },
    restoreDefaultSettingshandler: function () {
        ipcMain.handle('restoreDefaultSettings', async (e) => {
            try {
                return await restoreDefaultSettings();
            } catch (err) {
                return err;
            }
        });
    }
};

module.exports = ipcSettings;