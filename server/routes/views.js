const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

router.get('/available-rooms', viewsController.getAvailableRoomsByZone);
router.get('/room-capacity', viewsController.getRoomCapacityByHotel);

module.exports = router;
