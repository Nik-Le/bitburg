const  User = require('../models/User');
const  passwordEntry = require('../models/Passwords');

// POST Logic für Registrierung
exports.registerUser = async (req, res) => {
    try {
        const { username, email, premiumuser, salt, authHash } = req.body;
        
        // Prüfen ob User existiert
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
             // Wichtig: return nutzen, damit der Code hier stoppt
            console.log("User already exist");
            return res.status(400).json({
                error: 'User already in database',
                message: "Benutzername existiert bereits",
                success: false
            });
        }

        const newUser = new User({ username, email, premiumuser: premiumuser === 'on', salt, authHash });
        console.log(newUser);
        await newUser.save();
        
        return res.status(200).json({
            message: 'Erfolgreich',
            success: true,
            redirectUrl: '/login'
        });
    } catch (error) {
        console.error(error);
         return res.status(500).json({
            message: "Server Fehler beim Registrieren",
            success: false,
            error: error
        });
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
                success: true,
                message: 'Erfolgreich',
                redirectUrl: '/wallet'
            });

            const allEntrys = await passwordEntry.find({owner: user._id});

        } else {
            return res.status(401).json({
                error: 'user with password not found in database',
                success: false,
                message: 'Login Fehlgeschlagen, Passwort oder Benutzername falsch'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Login Fehler.",
            success: false,
            error: error});
    }           
};

// Logout
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({
                error: "Logout failed",
                success: false,
                message: 'Logout fehlgeschlagen'})
        }
        
        res.clearCookie('connect.sid');
        res.status(200).json({
            message: "Erfolgreich",
            success: true});

    });
    
};                              