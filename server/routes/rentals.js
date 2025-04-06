const express = require('express');
const router = express.Router();
const rentalsController = require('../controllers/rentalsController');

router.post('/', rentalsController.createRental);
router.put('/:id/pay', rentalsController.markPaymentComplete);

module.exports = router;
