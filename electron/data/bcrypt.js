const bcrypt = require('bcrypt');

async function genHash(plaintext) {
    return await bcrypt.hash(plaintext, 13);
}

async function compareHash(plaintext, hash) {
    return await bcrypt.compare(plaintext, hash);
}

module.exports = {
    genHash,
    compareHash
}