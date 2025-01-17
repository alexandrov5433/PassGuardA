# PassGuardA

## About
This application is an offline, desktop password manager for Windows.

## Installation
1. Download the .MSI destributable from the `windows_installer` derectory.

2. Install the program in the desired location. A desktop shortcut is created automaticaly.

## Code and Structure
The application is created with the help of the Electron and Angular frameworks. It works offline by managing all of the data in its file structure, in JSON format. Data hashing is done with the [bcrypt](https://www.npmjs.com/package/bcrypt) library. The encrypting and decrypting processes use the `aes-256-gcm` algorithm with the `Crypto` Node.js module.

## Fucntionality
Upon startup if a user account exists the login page is shown. Otherwise the user is routed to the register page to create an account. Only one account can exist at a time.

The user can add, edit or remove an unlimited amount of credentials (Title, Username, Password). Credentials can be searched for by Title using the search bar. The password can be copied directly to the clipboard without revealing it and its visibility can be toggled. The settigs page provides the option to choose the appearance of the application between light and dark. Other available features are: automatic logout after a set duration of inactivity, accout blocking and/or deletion after a given number of failed login attempts, manual account deletion and exportation of all saved credentials, with the passwords in plaintext, to a chosen destination as a .txt file.

Random password generation is an option when registering and when creating a new credential. At credential creation, the password generation can be adjusted: exclude specific characters, password length, use upper/lower case letters, numbers and symbols.
