const express = require('express');
const rutesComunitat = express.Router();
const comunitatController = require('../controllers/comunitatController');

// Routes
rutesComunitat.get('/', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
}, comunitatController.view);

// rutesComunitat.get('/config', function (req, res, next) {
//     req.app.locals.layout = 'main';
//     next();
// }, comunitatController.view2);

// rutesComunitat.get('/crear_bd', function (req, res, next) {
//     req.app.locals.layout = 'main';
//     next();
// }, comunitatController.crearBd);

rutesComunitat.get('/mode', function (req, res, next) {   
    next();
},comunitatController.mode);

rutesComunitat.get('/interrupcions', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
}, comunitatController.interrupcions);

module.exports = rutesComunitat;