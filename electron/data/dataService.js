
const fsp = require('node:fs/promises');
const { v4: uuidv4 } = require('uuid');

const { genHash, compareHash } = require('./bcrypt.js');
const { pathData } = require('../util/path.js');
const { encrypt, decrypt } = require('./crypto.js');

let secret;

async function accountExists() {
    const file = await getFile(pathData.session);
    return file.accountExists;
}

async function getFile(pathToFile) {
    let data = await fsp.readFile(pathToFile, { encoding: 'utf-8' });
    return JSON.parse(data);
}

async function saveFile(pathToFile, data) {
    await fsp.writeFile(pathToFile, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
}

async function confirmLogin(loginData) {
    if (!await accountExists()) {
        throw new Error('No account exists. Redirecting to Register page in 5 sec.');
    }
    const { username, password } = loginData;
    let session = await getFile(pathData.session);
    const usernameCorrect = await compareHash(username, session.username);
    const passwordCorrect = await compareHash(password, session.mainKey);
    if ( usernameCorrect && passwordCorrect ) {
        secret = password;
        return true;
    } else {
        throw new Error('Incorrect username or password.');
    }
}

async function registerUser(regData) {
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
}

async function confirmLogout() {
    secret = null;
    return true;
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
        console.error(e);
        return e;
    }
}

async function getCredentialsById(id) {
    const sensitiveFile = await getFile(pathData.sensitive);
    const target = sensitiveFile.find( e => e.id === id );
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
}

async function getCredentialsOverview() {
    const overview = [];
    (await getFile(pathData.sensitive)).forEach( e => {
        overview.push(Object.assign({}, { id: e.id, title: e.title, username: e.username, password: '' }));
    });
    return overview;
}

async function deleteCredentialsById(id) {
    try {
        const sensitiveFile = await getFile(pathData.sensitive);
        const target = sensitiveFile.find( e => e.id === id );
        if (target === undefined) {
            throw new Error(`Credentials with ID (${id}) do not exist.`);
        }
        const afterDeletion = sensitiveFile.filter( e => e.id !== target.id );
        await saveFile(pathData.sensitive, afterDeletion);
        return true;
    } catch (err) {
        return err;
    }
}

async function editCredentialsById(id, data) {
    try {
        const sensitiveFile = await getFile(pathData.sensitive);
        const target = sensitiveFile.find( e => e.id === id );
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

module.exports = {
    accountExists,
    registerUser,
    confirmLogin,
    confirmLogout,
    saveNewCredentials,
    getCredentialsById,
    getCredentialsOverview,
    deleteCredentialsById,
    editCredentialsById
};