const express = require('express');
const rutesUsuari = express.Router();
const userController = require('../controllers/userController');

// Routes
rutesUsuari.get('/', userController.view);
rutesUsuari.post('/', userController.find);
rutesUsuari.get('/adduser', userController.form);
rutesUsuari.post('/adduser', userController.create);
rutesUsuari.get('/edituser/:idUsuari', userController.edit);
rutesUsuari.post('/edituser/:idUsuari/:idComunitat', userController.update);
rutesUsuari.get('/viewuser/:idUsuari', userController.viewall);
rutesUsuari.get('/:idUsuari',userController.delete);
  
module.exports = rutesUsuari;