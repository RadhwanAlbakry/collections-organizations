const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Organization = require('../models/organization');
const OrganizationUser = require('../models/organization_user');
const Collection = require('../models/collection');
const OrganizationCollection = require('../models/organization_collection');
const Bookmark = require('../models/bookmark');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
    
require('dotenv').config({ path: `${process.cwd()}/.env` });
dotenv.config();

const sendInvitationEmail = require('../utils/email'); 

exports.createOrganization = async (req, res) => {
    if (req.user) {
        try {
            const { name, description } = req.body;
            const organization = await Organization.create({ name, description });
    
            const organizationUser = await OrganizationUser.findOne({
                where: { organizationId: organization.id, userId: req.user.id }
            });
    
            if (!organizationUser) {
                await OrganizationUser.create({
                    organizationId: organization.id,
                    userId: req.user.id,
                    role: 'owner'
                });
            }
            res.status(201).json(organization);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

};

exports.inviteUser = async (req, res) => {
    if (req.user) {
        try {
            const { email, organizationId } = req.body;

            const orgUser = await OrganizationUser.findOne({ where: { userId: req.user.id, organizationId: organizationId } });

            if (!orgUser) {
                return res.status(403).json({ error: "Forbidden", message: "You must be part of the organization to invite others" });
            }   

            const token = jwt.sign({ email, organizationId }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    
            const invitationLink = `${process.env.APP_URL}/accept-invitation?token=${token}`;
    
            console.log(`Please accept the invitation by clicking the following link: ${invitationLink}`);
            // res.status(201).json({message: `Please accept the invitation by clicking the following link: ${invitationLink}`})
            await sendInvitationEmail(email, token);
    
            res.status(201).json({ message: 'Invitation sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }


    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

};

exports.acceptInvitation = async (req, res) => {
    try {
        const { token } = req.body; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { email, organizationId } = decoded; 
        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({username: email, email: email, password: 'defaultpassword' });
        }

        const organizationUser = await OrganizationUser.findOne({
            where: { organizationId, userId: user.id }
        });

        if (!organizationUser) {
            await OrganizationUser.create({
                organizationId,
                userId: user.id,
            });
        }

        res.status(200).json({ message: 'Invitation accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.getOrganizations = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
        const orgUser = OrganizationUser.findOne({where: {userId: req.user.id}});
        if (!orgUser) {
            return res.status(404).json({ message: "You do not have organization!" });
        }
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Organization,
                through: { attributes: [] } 
            }
        });

        if (!user) {
            return res.status(404).json({ message: "No such user!" });
        }

        return res.status(200).json({ organizations: user.Organizations });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: "An error occurred while fetching organizations" });
    }
};

const Tag = require('../models/tag')
exports.listOrganizationCollections = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }
    
    try {
        const orgUser = await OrganizationUser.findOne({ where: { userId: req.user.id , organizationId: req.params.organizationId} });
        const orId =req.params.organizationId;

        if (!orgUser) {
            return res.status(403).json({ error: "Forbidden", message: "Forbidden " + orId });
        }

        const organizationCollections = await OrganizationCollection.findOne({
            where: {organizationId: orgUser.organizationId}
        });
        const collections = await Collection.findAll({
            include: [
                {
                    model: Bookmark,
                    as: 'Bookmarks',
                    include: [{
                        model: Tag,
                        as: 'Tags'
                    }]
                },
                {
                    model: Organization,
                     attributes: [] ,
                    where: { id: orId }
                }
            ],
        });
        if (!organizationCollections || organizationCollections.length === 0) {
            return res.status(404).json({ message: "No organization collections found!" });
        }

        return res.status(200).json({ collections });

    } catch (error) {
        return res.status(500).json({ error: error.message, message: "An error occurred while fetching organization collections" });
    }
};


exports.deleteOrganization = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
        const { organizationId } = req.params;
        const organization = await Organization.findByPk(organizationId);

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        const orgUser = await OrganizationUser.findOne({ 
            where: { 
                organizationId: organizationId,
                userId: req.user.id,
                role: 'owner'
            } 
        });
        
        if (!orgUser) {
            return res.status(403).json({ error: "Forbidden", message: "Only owners can delete the organization" });
        }

        await organization.destroy();
        res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.listUsers = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
        const { organizationId } = req.params;

        const isMember = await OrganizationUser.findOne({
            where: {
                organizationId: organizationId,
                userId: req.user.id
            }
        });

        if (!isMember) {
            return res.status(403).json({ error: "Forbidden", message: "You are not a member of this organization" });
        }

        const organization = await Organization.findByPk(organizationId, {
            include: {
                model: User,
                through: {
                    attributes: [] 
                }
            },
        });

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.status(200).json(organization.Users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.removeUser = async (req, res) => {
    if (req.user) {
        try {
            const { organizationId, userId } = req.params;

            const authUserOrg = await OrganizationUser.findOne({
                where: { organizationId, userId: req.user.id }
            });

            if (!authUserOrg) {
                return res.status(403).json({ error: "Forbidden", message: "You are not part of this organization" });
            }

            if (authUserOrg.role === 'member') {
                return res.status(403).json({ error: "Forbidden", message: "Members cannot remove users" });
            }

            const organizationUser = await OrganizationUser.findOne({
                where: { organizationId, userId }
            });
    
            if (!organizationUser) {
                return res.status(404).json({ error: 'User not found in organization' });
            }
    
            await organizationUser.destroy();
            res.status(200).json({ message: 'User removed from organization' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }


    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

};


exports.deleteOrganizationCollection = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
        const { organizationCollectionId } = req.params;

        const organizationCollection = await OrganizationCollection.findOne({where: {collectionId: organizationCollectionId}});

        if (!organizationCollection) {
            return res.status(404).json({ error: 'Organization collection not found' });
        }

        const orgUser = await OrganizationUser.findOne({
            where: { 
                organizationId: organizationCollection.organizationId,
                userId: req.user.id 
            }
        });

        if (!orgUser) {
            return res.status(403).json({ error: "Forbidden", message: "You are not part of this organization" });
        }

        const collection = await Collection.findByPk(organizationCollection.collectionId);

        if (orgUser.role !== 'admin' && collection.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden", message: "You do not have permission to delete this organization collection" });
        }

        await organizationCollection.destroy();
        res.status(200).json({ message: 'Organization collection deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



exports.countOrganizationCollections = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
        const { organizationId } = req.params; 

        const orgUser = await OrganizationUser.findOne({
            where: {
                userId: req.user.id,
                organizationId
            }
        });

        if (!orgUser || !['admin', 'member'].includes(orgUser.role)) {
            return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
        }

        const { count, rows } = await OrganizationCollection.findAndCountAll({
            where: {
                organizationId
            },
            include: [{
                model: Collection,
                attributes: []
            }]
        });

        res.status(200).json({ count, rows });
    } catch (error) {
        console.error('Error counting Organization Collections:', error);
        res.status(500).json({ error: error.message });
    }
};

