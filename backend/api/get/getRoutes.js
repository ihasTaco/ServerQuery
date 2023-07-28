const express = require('express');
const router = express.Router();
require('dotenv').config({ path: '../../../.env' });

const botRoutes = require('./botRoutes');
const discordRoutes = require('./discordRoutes');
const localRoutes = require('./localRoutes');

router.use('/bot', botRoutes);
router.use('/discord', discordRoutes);
router.use('/local', localRoutes);

module.exports = router;