const express = require('express');
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateJWT, userController.profile);
router.put('/', authenticateJWT, userController.updateUser);

module.exports = router;

