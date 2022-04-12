const express = require('express');
const rutesComunitat = express.Router();
const comunitatController = require('../controllers/comunitatController');

// Routes
rutesComunitat.get('/', function (req, res, next) {
    req.app.locals.layout = 'main'; 
    next(); 
    }, comunitatController.view2);
// router2.post('/comunitat', comunitatController.view2);  
module.exports = rutesComunitat;