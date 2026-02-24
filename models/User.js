/**
 * Mongoose schema for an encrypted password entry.
 * @typedef {Object} User
 * @property {String} username - Username 
 * @property {String} email - user Email entered by login
  * @property {Booleaan} premiumuser - true: can Use password generator
 * @property {String} salt - The salt is needed for deviration of the Masterkey
 * @property {String} authHash  - is hashed with bcrypt to verifie User 
 * @property {mongoose.Schema.Types.ObjectId} owner - Reference to the User who owns this entry.
 */
const mongoose = require('mongoose');
const userVorlage = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    premiumuser: {
        type: Boolean,
        required: true,
    },
    salt: {
        type: String,
        required: true
    },
    authHash: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userVorlage);