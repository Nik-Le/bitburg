const mongoose = require('mongoose');
const userVorlage = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    premiumuser: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('User', userVorlage);