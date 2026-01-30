const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {

    console.log(req.body);

    //res.json({message: 'Alles ok!'});
});


module.exports = router;