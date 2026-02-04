const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController')

router.post('/wallet', walletController.addPassword);

module.exports = router;