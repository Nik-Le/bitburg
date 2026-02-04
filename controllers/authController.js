const  User = require('../models/User') 

// POST Logic für Registrierung
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Prüfen ob User existiert
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
             // Wichtig: return nutzen, damit der Code hier stoppt
            return res.render('register', { title: 'Register', error: 'User existiert bereits!' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        
        console.log('User angelegt!');
        res.redirect('/login'); // Nach Registrierung zum Login
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Fehler beim Registrieren");
    }
};

// POST Logic für Login
exports.loginUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.findOne({ username: username }); // Email oft optional beim Login

        if (user && user.password === password) {
            req.session.userId = user._id;
            console.log("Login erfolgreich");
            res.redirect('/wallet'); 
        } else {
            res.render('login', { title: 'Login', error: 'Falsche Daten!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Login Fehler.");
    }
};

// Logout (Bonus)
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};