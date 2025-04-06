const express = require('express');
const router = express.Router();
const chainsController = require('../controllers/chainsController');

router.get('/', chainsController.getAllChains); // GET /api/chains
router.post('/', chainsController.addChain);   // POST /api/chains
router.delete('/:id', chainsController.deleteChain); // DELETE /api/chains/:id

module.exports = router;
