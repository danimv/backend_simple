const express = require('express');
const rutesInici = express.Router();
const iniciController = require('../controllers/iniciController');

// Routes
rutesInici.get('/', iniciController.view);
 
module.exports = rutesInici;