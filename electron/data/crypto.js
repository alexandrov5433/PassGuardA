const crypto = require('node:crypto');
//symmetric encryption and decryption
//save iv and tag

function encrypt(plaintext, key) {
    const iv = crypto.randomBytes(12);  // randomBytes returns Buffer; converting to return iv as string at end
    const keyBuff = Buffer.alloc(32, 0);
    keyBuff.write(key);

    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        keyBuff,
        iv
    );
    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    const tag = cipher.getAuthTag().toString('base64');
    return { ciphertext, iv: iv.toString('base64'), tag };
}

function decrypt(ciphertext, key, iv, tag) {
    const keyBuff = Buffer.alloc(32, 0);
    keyBuff.write(key);

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        keyBuff,
        Buffer.from(iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
    plaintext += decipher.final('utf8');
    return plaintext;
}


module.exports = {
    encrypt,
    decrypt
};