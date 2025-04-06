const express = require('express');
const router = express.Router();
const archiveController = require('../controllers/archiveController');

router.post('/:rental_id', archiveController.archiveRental);

module.exports = router;
