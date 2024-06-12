const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const authenticateJWT = require('../middleware/auth');

router.get('/', authenticateJWT, organizationController.getOrganizations);
router.post('/', authenticateJWT, organizationController.createOrganization);
router.post('/invite', authenticateJWT, organizationController.inviteUser);
router.post('/accept-invitation', organizationController.acceptInvitation);
router.delete('/:organizationId', authenticateJWT, organizationController.deleteOrganization);
router.get('/:organizationId/users', authenticateJWT, organizationController.listUsers);
router.get('/:organizationId/collections', authenticateJWT, organizationController.listOrganizationCollections);
router.delete('/:organizationId/collections/:organizationCollectionId', authenticateJWT, organizationController.deleteOrganizationCollection);
router.delete('/:organizationId/users/:userId', authenticateJWT, organizationController.removeUser);
router.get('/:organizationId/collections/count/:id', authenticateJWT, organizationController.countOrganizationCollections);

module.exports = router;
