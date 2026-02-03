const express = require('express');
const router = express.Router();
const User = require('../models/User');
router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './views' });
});
router.post('/register', async(req, res) => {
    try {
        const { username, email } = req.body;
        const existingUser = await User.findOne({username: username, email: email});
        if (existingUser) {
            return res.status(400).json({error:"Dieser Benutzername ist schon vergeben"});
        }
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
    await newUser.save();
    console.log('User angelegt!');
    }
    catch(error) {
        console.error(error);
        res.status(201).json({ message: "Erfolgreich registriert!" });
    }
    });
router.post('/login', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // sucht user in DB
        const user = await User.findOne({ username: username, email: email });

        // existiert user
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