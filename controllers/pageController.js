const passwordEntry = require('../models/Passwords');
const User = require('../models/User');

/**
 * Renders the home page.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.home = (req, res) => {
    res.render('index', {
        title: 'Startseite'
    });
};

/**
 * Renders the login page.
 */
exports.login = (req, res) => {
    res.render('login', {
        title: 'Login'
    });    
};

/**
 * Renders the registration page.
 */
exports.register = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

/**
 * Fetches the user's password entries, then renders the wallet dashboard.
 */
exports.wallet = async (req, res) => {
    try {
        const owner = req.session.userId;

        // 1. Fetch password entries for the current user
        const data = await passwordEntry.find({
            owner: owner
        });
        
        // 2. Fetch user information (including premium status)
        const currentUser = await User.findById(owner);

        // 3. Send data to the view
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
 
/**
 * Renders the 'About Us' page.
 */
exports.aboutUs = (req, res) => {
    res.render('aboutUs', {
        title: 'aboutUs'
    });
};