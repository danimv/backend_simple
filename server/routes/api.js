const express = require('express');
const rutesApi = express.Router();
const apiController = require('../controllers/apiController');

// Routes
// Vinculacio comunitat amb servidor extern
rutesApi.post('/init', function (req, res, next) {    
    next();
},apiController.init);

rutesApi.post('/update', function (req, res, next) {   
    next();
},apiController.update);

// rutesApi.post('/init_user', function (req, res, next) {  
//     next();
// },apiController.startUser);

// rutesApi.get('/sync', function (req, res, next) {  
//     next();
// },apiController.sync);

module.exports = rutesApi;