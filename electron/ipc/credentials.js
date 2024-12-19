const { ipcMain } = require('electron');
const { getCredentialsOverview, saveNewCredentials, getCredentialsById, deleteCredentialsById, editCredentialsById } = require('../data/dataService.js');
const passwordGenerator = require('../util/passwordGeneration.js');

const ipcCredentials = {
    credOverviewReqHandler: function () {
        ipcMain.handle('credOverviewReq', async (e) => {
            return await getCredentialsOverview();
        });
    },
    addCredentialsHandler: function (win, pathViews) {
        ipcMain.on('addCreds', async (e, creds) => {
            await saveNewCredentials(creds);
            win.loadFile(pathViews.home);
        })
    },
    fetchPassPlainTextHandler: function () {
        ipcMain.handle('fetchPassPlainText', async (e, credId) => {
            try {
                const { password } = await getCredentialsById(credId);
                return password;
            } catch (err) {
                return err;
            }
        })
    },
    deleteCredsByIdHandler: function () {
        ipcMain.handle('deleteCredsById', async (e, credId) => {
            try {
                return await deleteCredentialsById(credId);
            } catch (err) {
                return err;
            }
        })
    },
    fetchCredsByIdHandler: function () {
        ipcMain.handle('fetchCredsById', async (e, credId) => {
            try {
                const creds = await getCredentialsById(credId);
                creds.password = null;
                return creds;
            } catch (err) {
                return err;
            }
        });
    },
    sendCorrectionForCredsByIdHandler: function () {
        ipcMain.handle('sendCorrectionForCredsById', (e, credId, data) => {
            try {
                const res = editCredentialsById(credId, data);
                return res;
            } catch (err) {
                return err;
            }
        });
    },
    generatePasswordHandler: function () {
        ipcMain.handle('passwordGeneration', (e, passSettings) => {
            return passwordGenerator(passSettings);
        });
    }
};

module.exports = ipcCredentials;