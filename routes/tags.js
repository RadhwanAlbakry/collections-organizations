const express = require('express');
const tagController = require('../controllers/tagController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateJWT, tagController.createTag);
router.get('/:bookmarkId', authenticateJWT, tagController.getAllTags);
router.put('/:id', authenticateJWT,tagController.updateTag);
router.delete('/:id', authenticateJWT,tagController.deleteTag);

module.exports = router;
