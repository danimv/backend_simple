const express = require('express');
const rutesApi = express.Router();
const apiController = require('../controllers/apiController');

// Routes
// Vinculacio comunitat amb servidor extern
rutesApi.post('/init', function (req, res, next) {    
    next();
},apiController.init);
// rutesApi.post('/update', function (req, res, next) {   
//     next();
// },apiController.update);
// rutesApi.post('/start_user', function (req, res, next) {  
//     next();
// },apiController.start_user);

module.exports = rutesApi;