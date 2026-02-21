const  passwordEntry = require('../models/Passwords')
const User = require('../models/User'); // <--- DIESE ZEILE HINZUFÜGEN

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
    
        try {
            const owner = req.session.userId;

            // 1. Passwörter holen (Ihr Code)
            const data = await passwordEntry.find({
                owner: owner
            });
            

            // 2. Benutzer-Infos (inkl. Premium-Status) holen (NEU)
            const currentUser = await User.findById(owner);

            // 3. Alles an die View senden (Wichtig: 'user' hinzufügen)
            res.render('wallet', {
                title: 'Wallet',
                passwordList: JSON.stringify(data),
                user: currentUser
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("Ein Fehler ist aufgetreten");
        }
};

exports.aboutUs = (req, res) => {

    res.render('aboutUs', {
        title: 'aboutUs'
    })
};