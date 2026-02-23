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