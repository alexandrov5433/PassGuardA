const { ipcMain } = require('electron');
const {  accountExists, registerUser, confirmLogin, confirmLogout } = require('../data/dataService.js');

const ipcUserAccount = {
    accountExists: function () {
        ipcMain.handle('accountExists', async () => {
            try {
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
        ipcMain.handle('logout', async () => {
            return await confirmLogout();
        });
    }
}

module.exports = ipcUserAccount;