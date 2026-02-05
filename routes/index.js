/**
 * 
 */

const express = require('express');
const router = express.Router();

const indexRoutes = require('./indexRoutes');
const authRoutes = require('./authRoutes');
const walletRoutes = require('./walletRoutes');

router.use('/', indexRoutes);
router.use('/', authRoutes);
router.use('/', walletRoutes)

module.exports = router;