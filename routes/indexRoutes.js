/**
 * @module indexRoutes
 * @description Defines routes for rendering the main application frontend pages.
 */
const express = require('express');
const router = express.Router();

const pageController = require('../controllers/pageController');
const authController = require('../controllers/authController')

/**
 * @route   GET /
 * @desc    Renders the landing/home page.
 * @access  Public
 */
router.get('/', pageController.home);

/**
 * @route   GET /login
 * @desc    Renders the login page.
 * @access  Public
 */
router.get('/login', pageController.login);

/**
 * @route   GET /register
 * @desc    Renders the registration page.
 * @access  Public
 */
router.get('/register', pageController.register);

/**
 * @route   GET /wallet
 * @desc    Renders the user's password wallet page. Requires authentication.
 * @access  Private
 */
router.get('/wallet', authController.requireLogin,  pageController.wallet);

/**
 * @route   GET /aboutUs
 * @desc    Renders the About Us page.
 * @access  Public
 */
router.get('/aboutUs', pageController.aboutUs);

module.exports = router;