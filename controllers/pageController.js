const  passwordEntry = require('../models/Passwords')

exports.home = (req, res) => {

    res.render('index', {
        title: 'Startseite'
    });
};

exports.login = (req, res) => {

    res.render('login', {
        title: 'Login'
    });    
};

exports.register = (req, res) => {

    res.render('register', {
        title: 'Register'
    })
};

exports.wallet = async (req, res) => {
    const owner = req.session.userId;
    const data = await passwordEntry.find({
        owner: owner
    });
    res.render('wallet', {
        title: 'Wallet',
        passwordList: data
    })
};

exports.aboutUs = (req, res) => {

    res.render('aboutUs', {
        title: 'aboutUs'
    })
};