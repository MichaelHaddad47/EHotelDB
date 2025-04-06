const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

router.get('/', roomsController.getAvailableRooms);
router.get('/all', roomsController.getAllRooms);
router.put('/:id/damage', roomsController.updateRoomDamage);

module.exports = router;
