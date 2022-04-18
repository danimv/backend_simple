const express = require('express');
const rutesUsuari = express.Router();
const userController = require('../controllers/userController');

// Routes
rutesUsuari.get('/', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
},  userController.view);
rutesUsuari.post('/', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
},userController.find);
rutesUsuari.get('/adduser', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
},userController.form);
rutesUsuari.post('/adduser', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
}, userController.create);
rutesUsuari.get('/edituser/:idUsuari', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
}, userController.edit);
rutesUsuari.post('/edituser/:idUsuari/:idComunitat', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
}, userController.update);
rutesUsuari.get('/viewuser/:idUsuari', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
}, function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
}, userController.viewall);
rutesUsuari.get('/:idUsuari', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
},userController.delete);
  
module.exports = rutesUsuari;