const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateJWT, bookmarkController.createBookmark);
router.get('/:collectionId', authenticateJWT, bookmarkController.getBookmarks);
router.put('/:id', authenticateJWT,bookmarkController.updateBookmark);
router.delete('/:id', authenticateJWT,bookmarkController.deleteBookmark);

module.exports = router;
