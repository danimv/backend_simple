const express = require('express');
const router = express.Router();
const comunitatController = require('../controllers/comunitatController');

// Routes
router.get('/comunitat/', comunitatController.view);
  
module.exports = router;