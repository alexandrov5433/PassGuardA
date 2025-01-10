const { ipcMain } = require('electron');
const {  accountExists, registerUser, confirmLogin, confirmLogout, deleteUserAccount, dateInMsIfAccountBlocked } = require('../data/dataService.js');

const ipcUserAccount = {
    accountExists: function () {
        ipcMain.handle('accountExists', async () => {
            try {
                const msIfAccBlocked = await dateInMsIfAccountBlocked();
                if (msIfAccBlocked) {
                    return msIfAccBlocked;
                }
                return await accountExists(); 
            } catch (err) {
                console.log(err);
                return err;
            }
        })
    },
    registrationHandler: function () {
        ipcMain.handle('register', async (e, regData) => {
            try {
                return await registerUser(regData);
            } catch (err) {
                console.log(err);
                return err;
            }
        });
    },
    loginHandler: function () {
        ipcMain.handle('login', async (e, loginData) => {
            try {
                return await confirmLogin(loginData);
            } catch (err) {
                console.log(err);
                return err;
            }
        });
    },
    logoutHandler: function () {
        ipcMain.handle('logout', () => {
            return confirmLogout();
        });
    },
    deleteUserAccountHandler: function () {
        ipcMain.handle('deleteUserAccount', async (e, password) => {
            try {
                return await deleteUserAccount(password);
            } catch (err) {
                return err;
            }
        });
    }
}

module.exports = ipcUserAccount;