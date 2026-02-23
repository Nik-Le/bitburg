const User          = require('../models/User');
const passwordEntry = require('../models/Passwords');
const bcrypt        = require('bcrypt');

// ─── Registrierung ───────────────────────────────────────────────────────────

exports.registerUser = async (req, res) => {
    try {
        const { username, email, premiumuser, salt, authHash } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Benutzername ist bereits vergeben.' });
        }

        // authHash aus dem Frontend nochmals hashen (Defense in Depth)
        const doubleHash = await bcrypt.hash(authHash, 10);
        const hashedUser = await bcrypt.hash(username, 10);
        const hasedEmail = await bcrypt.hash(email, 10);

        const newUser = new User({
            username: hashedUser,
            email: hasedEmail,
            premiumuser: premiumuser === 'on',
            salt,
            authHash: doubleHash,
        });

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

// ─── Login ────────────────────────────────────────────────────────────────────

exports.loginUser = async (req, res) => {
    try {
        const { authHash } = req.body;

        // Username muss in der Session oder im Body vorhanden sein
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'Benutzer nicht gefunden.' });
        }

        const isValid = await bcrypt.compare(authHash, user.authHash);

        if (isValid) {
            req.session.userId   = user._id;
            req.session.username = user.username;
            req.session.isLoggedIn = true;
            return res.status(200).json({ message: 'Login erfolgreich.' });
        } else {
            return res.status(401).json({ message: 'Ungültiges Passwort.' });
        }

    } catch (error) {
        console.error('Fehler beim Login:', error);
        return res.status(500).json({ message: 'Serverfehler beim Login.' });
    }
};

// ─── Salt abrufen ─────────────────────────────────────────────────────────────

exports.getUserSalt = async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
        }

        return res.status(200).json({ salt: user.salt });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Login Fehler.",
            success: false,
            error: error});
    }           
};

// ─── Logout ───────────────────────────────────────────────────────────────────

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({
                error: "Logout failed",
                success: false,
                message: 'Logout fehlgeschlagen'})
        }

        res.clearCookie('connect.sid');
        res.clearCookie('sessionId');
        res.status(200).json({
            message: "Erfolgreich",
            success: true});

    });
};


//──────────────────── requiere Loged in ────────────────────

exports.requireLogin = function requiereLogin (req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        next(); // eingeloggt → weiter
    } else {
        res.redirect('/login'); // nicht eingeloggt → zurück
    }
};