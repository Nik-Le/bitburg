const express = require('express');
const router = express.Router();

const pageController = require('../controllers/pageController');

router.get('/', pageController.home);

router.get('/login', pageController.login);

router.get('/register', pageController.register);

router.get('/wallet',pageController.wallet);

module.exports = router;