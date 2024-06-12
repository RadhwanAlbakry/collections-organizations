const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/authorizationMiddleware');
const authenticateJWT = require('../middleware/auth');
const { deleteUser, getAllUsers,getAllOrganizations, getOrganizationsAndMembersCount } = require('../controllers/adminController');

// admin-only routes
router.delete('/user/:id', authenticateJWT, isAdmin, deleteUser);
router.get('/users', authenticateJWT, isAdmin, getAllUsers);
router.get('/organizations', authenticateJWT, isAdmin, getAllOrganizations); 
// Dashboard route
router.get('/dashboard', authenticateJWT, isAdmin, getOrganizationsAndMembersCount);
module.exports = router;
