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
    }
    // registrationHandler: function (win, pathViews) {
    //     ipcMain.handle('register', async (e, regData) => {
    //         try {
    //             await registerUser(regData);
    //             win.loadFile(pathViews.home);
    //         } catch (err) {
    //             console.log(err);
    //             setTimeout(() => {
    //                 win.loadFile(pathViews.login);
    //             }, 5000);
    //             return err;
    //         }
    //     });
    // },
    // loginHandler: function (win, pathViews) {
    //     ipcMain.handle('login', async (e, loginData) => {
    //         try {
    //             const res = await confirmLogin(loginData);
    //             if (res.success) {  //success = true || false
    //                 win.loadFile(pathViews.home);
    //             } else {
    //                 return res; 
    //             }
    //         } catch (err) {
    //             console.log(err);
    //             setTimeout(() => {
    //                 win.loadFile(pathViews.register);
    //             }, 5000);
    //             return err;
    //         }
    //     });
    // },
    // logoutHandler: function (win, pathViews) {
    //     ipcMain.handle('logout', async () => {
    //         const success = await confirmLogout();
    //         if (success) {
    //             win.loadFile(pathViews.login);
    //         }
    //     });
    // }
}

module.exports = ipcUserAccount;