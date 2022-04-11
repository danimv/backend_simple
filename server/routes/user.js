const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:idUsuari', userController.edit);
router.post('/edituser/:idUsuari/:idComunitat', userController.update);
router.get('/viewuser/:idUsuari', userController.viewall);
router.get('/:idUsuari',userController.delete);
  
module.exports = router;