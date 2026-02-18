const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController')

router.post('/wallet', walletController.addPassword);
router.post('/wallet/delete/:id', walletController.removePassword);

module.exports = router;