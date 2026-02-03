const mongoose = require('mongoose');
const passwordVorlage = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    usage:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Passwort', passwordVorlage);