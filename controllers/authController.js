const User          = require('../models/User');
const passwordEntry = require('../models/Passwords');
const bcrypt        = require('bcrypt');



/**
 * Registers a new user, hashes sensitive data (authHash and email), and saves the user to the database.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.registerUser = async (req, res) => {
    try {
        const { username, email, premiumuser, salt, authHash } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Benutzername ist bereits vergeben.' });
        }

        // Hash the authHash from the frontend again (Defense in Depth)
        const doubleHash = await bcrypt.hash(authHash, 10);
        const hasedEmail = await bcrypt.hash(email, 10);

        const newUser = new User({
            username,
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


/**
 * Authenticates a user by verifying the provided auth hash and initializes a session.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.loginUser = async (req, res) => {
    try {
        const { authHash } = req.body;

        // Username must be present in the body
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


/**
 * Retrieves the cryptographic salt for a given username to allow client-side key derivation.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
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


/**
 * Destroys the current user session and clears authentication cookies.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
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

/**
 * Middleware that restricts access to authenticated users, redirecting others to the login page.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
exports.requireLogin = function requireLogin (req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        next(); // Logged in → proceed
    } else {
        res.redirect('/login'); // Not logged in → redirect to login
    }
};