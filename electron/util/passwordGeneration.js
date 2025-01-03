const { generatePassword } = require('safe-pass-gen');

const defaultPassSettings = {
    passLength: 20,
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
    excludeSimilars: false,
    charsToExclude: ''
};

function passwordGenerator(options) {
    if (!options) {
        options = defaultPassSettings;
    }
    let pass = generatePass(options);
    if (options.charsToExclude != '') {
        pass = excludeChars(pass, options);
    }
    return pass;
}

function generatePass(options) {
    return generatePassword(
        options.passLength,
        {
            lowercase: options.lowercase,
            uppercase: options.uppercase,
            digits: options.digits,
            symbols: options.symbols,
            excludeSimilars: options.excludeSimilars
        }
    );
}

function excludeChars(strToProcess, options) {
    let str = strToProcess;
    let newCharSet = generatePassword(
        256,
        {
            lowercase: options.lowercase,
            uppercase: options.uppercase,
            digits: options.digits,
            symbols: options.symbols,
            excludeSimilars: options.excludeSimilars
        }
    );
    const charsToExclude = options.charsToExclude.split('') || [];
    charsToExclude.forEach(c => {
        while (newCharSet.includes(c)) {
            newCharSet = newCharSet.replace(c, '');
        }
    });
    charsToExclude.forEach(c => {
        while (str.includes(c)) {
            const randomIndex = Math.floor(Math.random() * newCharSet.length);
            str = str.replace(c, newCharSet[randomIndex]);
        }
    });
    return str;
}

module.exports = passwordGenerator;