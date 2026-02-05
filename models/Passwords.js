const mongoose = require('mongoose');

const passwordVorlage = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    siteName:{
        type: String,
        required: true,
    },
    password: {
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