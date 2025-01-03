const { ipcMain } = require('electron');
const { getCredentialsOverview, saveNewCredentials, getCredentialsById, deleteCredentialsById, editCredentialsById } = require('../data/dataService.js');
const passwordGenerator = require('../util/passwordGeneration.js');

const ipcCredentials = {
    credOverviewReqHandler: function () {
        ipcMain.handle('credOverviewReq', async (e) => {
            try {
                return await getCredentialsOverview();
            } catch (err) {
                return err;
            }
        });
    },
    addCredentialsHandler: function () {
        ipcMain.handle('addCreds', async (e, creds) => {
            return await saveNewCredentials(creds);
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
    sendCorrectionForCredsByIdHandler: function () {
        ipcMain.handle('sendCorrectionForCredsById', (e, data) => {
            try {
                return editCredentialsById(data.id, data);
            } catch (err) {
                return err;
            }
        });
    },
    generatePasswordHandler: function () {
        ipcMain.handle('passwordGeneration', (e, passSettings) => {
            try {
                return passwordGenerator(passSettings);
            } catch (err) {
                return err;
            }
        });
    }
};

module.exports = ipcCredentials;