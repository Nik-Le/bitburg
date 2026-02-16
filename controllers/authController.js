const  User = require('../models/User');
const  passwordEntry = require('../models/Passwords');

// POST Logic für Registrierung
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, premiumuser } = req.body;
        
        // Prüfen ob User existiert
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
             // Wichtig: return nutzen, damit der Code hier stoppt
            console.log("User already exist");
            return res.status(400).json({error: 'User existiert bereits'})

        }

        const newUser = new User({ username, email, password, premiumuser: premiumuser === 'on' });
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
        const passwordFeedbackLogin = document.getElementById('password-feedback-login');
        passwordFeedbackLogin.textContent = '';
        const { username, password} = req.body;
        const user = await User.findOne({ username: username }); // Email oft optional beim Login
        

        if (user && user.password === password) {
            req.session.userId = user._id;
            console.log("Login erfolgreich");
            res.status(200).json({
                message: 'Erfolgreich',
                redirectUrl: '/wallet'
            });

            const allEntrys = await passwordEntry.find({owner: user._id});
            console.log(allEntrys);

        } else {
            passwordFeedbackLogin.textContent = 'Login fehlgeschlagen';
            return res.status(401).json({error: 'Falsches Passwort',
                                    success: false,
                                    message: 'Login Fehlgeschlagen'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Login Fehler.");
    }           
};

// Logout
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({error: "Logout fehlgeschlagen"})
        }
        
        res.clearCookie('connect.sid');
        res.status(200).json({success: true});

    });
    
};