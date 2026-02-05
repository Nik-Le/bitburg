const  User = require('../models/User') 

// POST Logic für Registrierung
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Prüfen ob User existiert
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
             // Wichtig: return nutzen, damit der Code hier stoppt
            console.log("User already exist");
            return res.status(400).json({error: 'User existiert bereits'})

        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        
        return res.status(200).json({
            message: 'Erfolgreich',
            redirectUrl: '/login'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Fehler beim Registrieren");
    }
};

// POST Logic für Login
exports.loginUser = async (req, res) => {
    try {
        const { username, password} = req.body;
        const user = await User.findOne({ username: username }); // Email oft optional beim Login

        if (user && user.password === password) {
            req.session.userId = user._id;
            console.log("Login erfolgreich");
            res.status(200).json({
                message: 'Erfolgreich',
                redirectUrl: '/wallet'
            });
        } else {
            res.status(400).json({error: 'Falsches Passwort'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Login Fehler.");
    }
};

// Logout
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};