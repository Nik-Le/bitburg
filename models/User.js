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