const path = require('node:path');
const fsp = require('node:fs/promises');
const { v4: uuidv4 } = require('uuid');

const { genHash, compareHash } = require('./bcrypt.js');
const { pathData } = require('../util/path.js');
const { encrypt, decrypt } = require('./crypto.js');

let secret;

async function accountExists() {
    try {
        const file = await getFile(pathData.session);
        return Boolean(file.accountExists);
    } catch (err) {
        throw err;
    }
}

async function getFile(pathToFile) {
    let data = await fsp.readFile(pathToFile, { encoding: 'utf-8' });
    return JSON.parse(data);
}

async function saveFile(pathToFile, data) {
    await fsp.writeFile(pathToFile, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
}

async function confirmLogin(loginData) {
    try {
        if (!await accountExists()) {
            throw new Error('No account exists. Redirecting to Register page.');
        }
        const { username, password } = loginData;
        let session = await getFile(pathData.session);
        const usernameCorrect = await compareHash(username, session.username);
        const passwordCorrect = await compareHash(password, session.mainKey);
        if (usernameCorrect && passwordCorrect) {
            secret = password;
            return true;
        } else {
            let alreadyIncrementedForThisCicle = false;
            if (await isAccountBlockingOptionActivated()) {
                await incrtementFailedLoginAttemptsNumeberByOne();
                alreadyIncrementedForThisCicle = true;
                const curFailedAttempts = await getCurrentCountOfFailedLoginAttempts();
                const allowedAttempts = await getCountOfAllowedFailedLoginAttempts('block');
                if (curFailedAttempts >= allowedAttempts) {
                    await blockAccount();
                    throw new Error('Account BLOCKED due to excieding the set allowed number of faied login attempts.');
                }
            }
            if (await isAccountDeletionOptionActivated()) {
                if (!alreadyIncrementedForThisCicle) {
                    await incrtementFailedLoginAttemptsNumeberByOne();
                }
                const curFailedAttempts = await getCurrentCountOfFailedLoginAttempts();
                const allowedAttempts = await getCountOfAllowedFailedLoginAttempts('delete');
                if (curFailedAttempts >= allowedAttempts) {
                    await deleteAccountAfterFailedLogins();
                    throw new Error('Account DELETED due to excieding the set allowed number of faied login attempts.');
                }
            }
            throw new Error('Incorrect username or password.');
        }
    } catch (err) {
        throw err;
    }
}

async function registerUser(regData) {
    try {
        if (await accountExists()) {
            throw new Error('An account already exists.', { cause: 'accountExists' });
        }
        const { username, password } = regData;
        if (!username || !password) {
            throw new Error(`The values provided for either username or password are not valid. Received: username:"${username}", password:"${password}".`, { cause: 'invalidAccountData' });
        }
        let session = await getFile(pathData.session);
        session.accountExists = true;
        session.username = await genHash(username);
        session.mainKey = await genHash(password);
        await saveFile(pathData.session, session);
        secret = password;
        return true;
    } catch (err) {
        throw err;
    }
}

function confirmLogout() {
    secret = null;
    return true;
}

async function deleteUserAccount(password) {
    try {
        if (password !== secret) {
            throw new Error('Wrong password.');
        }
        await Promise.all([restoreDefaultSettings(), resetAccount(), resetCredentials()]);
        return true;
    } catch (err) {
        throw err;
    }
}

async function saveNewCredentials(data) {
    try {
        const { title, username, password } = data;
        const entry = {
            id: uuidv4(),
            title,
            username
        };
        const passEnc = encrypt(password, secret);
        entry.password = {
            value: passEnc.ciphertext,
            iv: passEnc.iv,
            tag: passEnc.tag
        };
        let sensitiveFile = await getFile(pathData.sensitive);
        sensitiveFile.push(entry);
        await saveFile(pathData.sensitive, sensitiveFile);
        return true;
    } catch (e) {
        return e;
    }
}

async function getCredentialsById(id) {
    try {
        const sensitiveFile = await getFile(pathData.sensitive);
        const target = sensitiveFile.find(e => e.id === id);
        if (target === undefined) {
            throw new Error(`Credentials with ID (${id}) do not exist.`);
        }
        const decrPass = decrypt(
            target.password.value,
            secret,
            target.password.iv,
            target.password.tag
        );
        target.password = decrPass; //plainText
        return target;
    } catch (err) {
        return err;
    }
}

async function getCredentialsOverview() {
    try {
        const overview = [];
        (await getFile(pathData.sensitive)).forEach(e => {
            overview.push(Object.assign({}, { id: e.id, title: e.title, username: e.username, password: '' }));
        });
        return overview;
    } catch (err) {
        throw err;
    }
}

async function deleteCredentialsById(id) {
    try {
        const sensitiveFile = await getFile(pathData.sensitive);
        const target = sensitiveFile.find(e => e.id === id);
        if (target === undefined) {
            throw new Error(`Credentials with ID (${id}) do not exist.`);
        }
        const afterDeletion = sensitiveFile.filter(e => e.id !== target.id);
        await saveFile(pathData.sensitive, afterDeletion);
        return true;
    } catch (err) {
        return err;
    }
}

async function editCredentialsById(id, data) {
    try {
        const sensitiveFile = await getFile(pathData.sensitive);
        const target = sensitiveFile.find(e => e.id === id);
        if (target === undefined) {
            throw new Error(`Credentials with ID (${id}) do not exist.`);
        }
        const updatedEntry = {
            id: target.id,
            title: data.title,
            username: data.username
        };
        const newPassEnc = encrypt(data.password, secret);
        updatedEntry.password = {
            value: newPassEnc.ciphertext,
            iv: newPassEnc.iv,
            tag: newPassEnc.tag
        };
        Object.assign(target, updatedEntry);
        await saveFile(pathData.sensitive, sensitiveFile);
        return true;
    } catch (err) {
        return err;
    }
}

// settings
async function getSettings(settingsType) {
    try {
        const allSettings = await getFile(pathData.settings);
        if (!allSettings[settingsType]) {
            throw new Error(`Settings of type: "${settingsType}" could not be found.`);
        }
        return allSettings[settingsType];
    } catch (err) {
        throw err;
    }
}

async function setSettings(settingsType, settingsSubType, newSettingsObj) {
    try {
        const allSettings = await getFile(pathData.settings);
        if (!allSettings[settingsType] || !allSettings[settingsType][settingsSubType]) {
            throw new Error(`Settings of type: "${settingsType}" or subtype: "${settingsSubType}" could not be found.`);
        }
        Object.assign(allSettings[settingsType][settingsSubType], newSettingsObj);
        await saveFile(pathData.settings, allSettings);
        return true;
    } catch (err) {
        throw err;
    }
}

async function restoreDefaultSettings() {
    try {
        const defaults = await getFile(pathData.defaultSettings);
        await saveFile(pathData.settings, defaults);
        return true;
    } catch (err) {
        throw err;
    }
}

async function resetAccount() {
    return await saveFile(pathData.session, {
        "accountExists": false,
        "username": null,
        "mainKey": null
    });
}

async function resetCredentials() {
    return await saveFile(pathData.sensitive, []);
    // sensitive.json structure
    // [  
    //     {
    //       "id": "9e519b84-ba7a-4dc9-a90d-56253e6b2d70",
    //       "title": "xxxxxx",
    //       "username": "xxxxx",
    //       "password": {
    //         "value": "LLDDGac7je+z5iJJjsnjE=",
    //         "iv": "IEgSF0aAxz78IOwU7i",
    //         "tag": "B73xxxVgx8sdKjlsU4/bKoUg=="
    //       }
    //     }
    // ]
}

async function getThemeVariables(themeStyle) {
    try {
        const themes = await getFile(pathData.themes);
        if (!themes[themeStyle]) {
            throw new Error(`The theme style "${themeStyle}" was not found.`);
        }
        return themes[themeStyle];
    } catch (err) {
        throw err;
    }
}

async function exportCredentialsPlain(destinationFullPath, password) {
    if (password !== secret) {
        throw new Error('Wrong password.');
    }
    const sensitiveFile = await getFile(pathData.sensitive);
    if (!sensitiveFile.length) {
        throw new Error('No credentials to export.');
    }
    if (!destinationFullPath) {
        throw new Error('Invalid exportation path.');
    }
    const dataPlain = [];
    for (let cred of sensitiveFile) {
        const passPlain = decrypt(
            cred.password.value,
            secret,
            cred.password.iv,
            cred.password.tag
        );
        dataPlain.push({
            title: cred.title,
            username: cred.username,
            password: passPlain
        });
    }

    let fileDataToWrite = `######  PassGuardA - Credentials  ######\n\n`;
    for (let cred of dataPlain) {
        const credsString = formatInfoToString({
            title: cred.title,
            username: cred.username,
            password: cred.password
        })
        fileDataToWrite = fileDataToWrite + credsString + '\n';
    }
    await createFile(fileDataToWrite, destinationFullPath);
    return true;

    async function createFile(fileData, destinationPath) {
        const _destination = path.normalize(
            path.join(destinationPath, 'PassGuardA_Credentials.txt')
        );
        return await fsp.writeFile(_destination, fileData, { encoding: 'utf-8' });
    }

    function formatInfoToString({ title, username, password }) {
        return `Title: ${title}\nUsername: ${username}\nPassword: ${password}\n`;
    }
}

//account blocking and deletion after number of failed logins
async function isAccountBlockingOptionActivated() {
    const settings = await getFile(pathData.settings);
    return settings.accountSettings.blockAccAfterNumberFailedLogins.state;
}
async function isAccountDeletionOptionActivated() {
    const settings = await getFile(pathData.settings);
    return settings.accountSettings.deleteAccAfterNumberFailedLogins.state;
}

async function getCurrentCountOfFailedLoginAttempts() {
    const persistentVars = await getFile(pathData.persistentVariables);
    return persistentVars.currentNumberOfFailedLoginAttempts;
}

/**
 * Get allowed attempts for account deletion or blocking options from settings.
 * @param {'delete' | 'block'} forOption
 * @returns 
 */
async function getCountOfAllowedFailedLoginAttempts(forOption) {
    const lib = {
        block: 'blockAccAfterNumberFailedLogins',
        delete: 'deleteAccAfterNumberFailedLogins'
    };
    const settings = await getFile(pathData.settings);
    return Number(settings.accountSettings[lib[forOption]].numberOfPermittedAttempts);
}

async function incrtementFailedLoginAttemptsNumeberByOne() {
    const persistentVars = await getFile(pathData.persistentVariables);
    persistentVars.currentNumberOfFailedLoginAttempts += 1;
    await saveFile(pathData.persistentVariables, persistentVars);
    return true;
}
 /**
  * If the account is blocked the datetime for when it will be unblocked is returned. If it is not blocked false is returned.
  * @returns {Promise<number | false>}
  */
async function dateInMsIfAccountBlocked() {
    const persistentVars = await getFile(pathData.persistentVariables);
    if (persistentVars.accountBlocking.isAccountCurrentlyBlocked) {
        return persistentVars.accountBlocking.dateTimeToUnblockAccount;
    }
    return false;
}
/**
 * Resets "currentNumberOfFailedLoginAttempts" to 0, "isAccountCurrentlyBlocked" to false and "dateTimeToUnblockAccount" to "".
 */
async function resetPersitentVariables() {
    const persistentVars = await getFile(pathData.persistentVariables);
    persistentVars.currentNumberOfFailedLoginAttempts = 0;
    persistentVars.accountBlocking.isAccountCurrentlyBlocked = false;
    persistentVars.accountBlocking.dateTimeToUnblockAccount = 0;
    await saveFile(pathData.persistentVariables, persistentVars);
    return true;
}

async function blockAccount() {
    const persistentVars = await getFile(pathData.persistentVariables);
    persistentVars.accountBlocking.isAccountCurrentlyBlocked = true;
    const accountBlockingDuration = await getDurationForAccountBlockingInMs();
    const datetimeToUnblockAcc = new Date().getTime() + accountBlockingDuration;
    persistentVars.accountBlocking.dateTimeToUnblockAccount = datetimeToUnblockAcc;
    await saveFile(pathData.persistentVariables, persistentVars);
    return true;
}

async function getDurationForAccountBlockingInMs() {
    const settings = await getFile(pathData.settings);
    const msInOneHour = 3600000;
    const msAccBlockDuration = Number(settings.accountSettings.blockAccAfterNumberFailedLogins.timeForBlockedStateHours) * msInOneHour;
    return msAccBlockDuration;
}

/**
 * Checks the time and unblocks the account if the time for blocking has passed.
 * @returns {Boolean} Returns true if the account was unblocked and false if not.
 */
async function unblockAccountIfTime() {
    const currentTime = new Date().getTime();
    const persistentVars = await getFile(pathData.persistentVariables);
    const timeToUnblock = persistentVars.accountBlocking.dateTimeToUnblockAccount;
    if (currentTime >= timeToUnblock) {
        return await resetPersitentVariables();
    }
    return false;
}

async function deleteAccountAfterFailedLogins() {
    const resAcc = resetAccount();
    const resCreds = resetCredentials();
    const resSettings = restoreDefaultSettings();
    await Promise.all([resAcc, resCreds, resSettings]);
    return true;
}

module.exports = {
    accountExists,
    registerUser,
    confirmLogin,
    confirmLogout,
    saveNewCredentials,
    getCredentialsById,
    getCredentialsOverview,
    deleteCredentialsById,
    editCredentialsById,
    getSettings,
    setSettings,
    restoreDefaultSettings,
    deleteUserAccount,
    getThemeVariables,
    exportCredentialsPlain,
    dateInMsIfAccountBlocked
};