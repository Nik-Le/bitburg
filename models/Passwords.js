/**
 * Mongoose schema for an encrypted password entry.
 * @typedef {Object} PasswordEntry
 * @property {String} iv - The initialization vector used for encryption.
 * @property {String} entry - The encrypted password string.
 * @property {mongoose.Schema.Types.ObjectId} owner - Reference to the User who owns this entry.
 */
const mongoose = require('mongoose');
const passwordVorlage = new mongoose.Schema({
    iv: {
        type: String,
        required: true 
    },
    entry:{
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('passwordEntry', passwordVorlage);