const express = require('express');
const router = express.Router();
const chainsController = require('./controllers/chainsController');

router.get('/chains', chainsController.getAllChains);
router.post('/chains', chainsController.addChain);
router.delete('/chains/:id', chainsController.deleteChain);

module.exports = router;
