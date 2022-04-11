const express = require('express');
const router2 = express.Router();
const comunitatController = require('../controllers/comunitatController');

// Routes
router2.get('/inici', comunitatController.view2);
// router2.post('/comunitat', comunitatController.view2);  
module.exports = router2;