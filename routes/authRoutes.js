const express = require('express');
const router = express.Router();
const User = require('../models/User');
router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './views' });
});
router.post('/register', async(req, res) => {
    try {
        const existingUser = await User.findOne({username: username});
        if (!existingUser) {
            return res.status(400).send("Dieser Benutzername ist schon vergeben{}");
        }
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
    await newUser.save();
    console.log('User angelegt!');
    res.redirect('/login');}
    catch(error) {
        console.error(error);
        res.stats(500).send('Fehler bei Registrierung');
    }
    });
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. User in der Datenbank suchen
        const user = await User.findOne({ username: username });

        // 2. Prüfen: Gibt es den User? Stimmt das Passwort?
        if (user && user.password === password) {

            // Login erfolgreich: Session setzen
            req.session.userId = user._id;
            console.log("Login erfolgreich für:", username);

            res.redirect('/wallet'); // Weiterleitung zur geschützten Seite

        } else {
            res.send("Falscher Benutzername oder falsches Passwort!");
        }

    } catch (error) {
        console.error(error);
        res.send("Login Fehler.");
    }
});


/*   console.log(req.body);

    res.json({});
});*/


module.exports = router;