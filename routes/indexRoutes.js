const express = require('express');
const router = express.Router();

const pageController = require('../controllers/pageController');
const authController = require('../controllers/authController')

router.get('/', pageController.home);

router.get('/login', pageController.login);

router.get('/register', pageController.register);

router.get('/wallet', authController.requireLogin,  pageController.wallet);

router.get('/aboutUs', pageController.aboutUs);

module.exports = router;     