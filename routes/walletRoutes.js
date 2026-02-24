/**
 * @module walletRoutes
 * @description Defines API routes for managing password wallet entries.
 */
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController')

/**
 * @route   POST /wallet
 * @desc    Adds a new password entry to the user's wallet.
 * @access  Private
 */
router.post('/wallet', walletController.addPassword);

/**
 * @route   POST /wallet/delete/:id
 * @desc    Removes a specific password entry by its ID.
 * @access  Private
 */
router.post('/wallet/delete/:id', walletController.removePassword);

module.exports = router;