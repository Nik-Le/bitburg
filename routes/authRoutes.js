/**
 * @module authRoutes
 * @description Defines API routes for user authentication and session management.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

/**
 * @route   POST /register
 * @desc    Registers a new user and hashes their password.
 * @access  Public
 */
router.post('/register', authController.registerUser);

/**
 * @route   POST /logina
 * @desc    Authenticates a user and establishes a session.
 * @access  Public
 */
router.post('/login', authController.loginUser);

/**
 * @route   POST /fetchSalt
 * @desc    Retrieves the specific cryptographic salt for a given user.
 * @access  Public
 */
router.post('/fetchSalt', authController.getUserSalt)

/**
 * @route   POST /logout
 * @desc    Destroys the user session and logs them out.
 * @access  Private
 */
router.post('/logout', authController.logoutUser);

module.exports = router;