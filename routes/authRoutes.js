const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {

    console.log(req.body);

    res.json({message: 'Alels ok!'});
});


module.exports = router;