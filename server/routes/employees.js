const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');

router.get('/', employeesController.getAllEmployees);
router.post('/login', employeesController.loginEmployee);

module.exports = router;
