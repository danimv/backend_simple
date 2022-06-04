const express = require('express');
const rutesReq = express.Router();
const userController = require('../controllers/reqController');

// Routes
rutesReq.post('/init', function (req, res, next) {    
    next();
},userController.find);
rutesReq.post('/update', function (req, res, next) {   
    next();
},userController.form);
rutesReq.post('/start_user', function (req, res, next) {  
    next();
},userController.form);

module.exports = rutesReq;