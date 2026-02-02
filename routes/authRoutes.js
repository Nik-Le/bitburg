const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/register', async(req, res) => {
    try {
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

/*   console.log(req.body);

    res.json({});
});*/


module.exports = router;