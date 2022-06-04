const express = require('express');
const rutesReq = express.Router();
const userController = require('../controllers/reqController');

// Routes
rutesReq.post('/init', function (req, res, next) {    
    next();
},userController.init);
rutesReq.post('/update', function (req, res, next) {   
    next();
},userController.update);
rutesReq.post('/start_user', function (req, res, next) {  
    next();
},userController.start_user);

module.exports = rutesReq;