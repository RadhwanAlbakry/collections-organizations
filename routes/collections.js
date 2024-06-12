const express = require('express');
const collectionController = require('../controllers/collectionController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateJWT,collectionController.createCollection);
router.get('/all', authenticateJWT, collectionController.getCollections);
router.put('/:id', authenticateJWT, collectionController.updateCollection);
router.delete('/:id', authenticateJWT, collectionController.deleteCollection);


module.exports = router;
