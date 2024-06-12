const Collection = require('../models/collection');
const User = require('../models/user');
const OrganizationUser = require('../models/organization_user');
const OrganizationCollection = require('../models/organization_collection');
const { where } = require('sequelize');


exports.createCollection = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "No such user!!" });
        }

        const name = req.body.name;
        const isOrgCol = req.body.isOrganizationCollection;
        const organizationId = req.body.organizationId;
        const orgUser = await OrganizationUser.findOne({ where: { userId: user.id } });
        console.log(orgUser)
        
        if (orgUser && orgUser.organizationId === organizationId) {
            const collection = await Collection.create({
                name: name,
                userId: req.user.id,
                isOrganizationCollection: isOrgCol
            });

            await OrganizationCollection.create({
                organizationId: orgUser.organizationId,
                collectionId: collection.id
            });

            return res.status(201).json({ message: 'Organization collection created successfully', data: collection });
        } else {
            const collection = await Collection.create({
                name: name,
                userId: req.user.id,
                isOrganizationCollection: isOrgCol
            });

            return res.status(201).json({ message: 'Collection created successfully', data: collection });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, message: "An error occurred while creating the collection" });
    }
};

exports.updateCollection = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "No such user!!" });
        }


        const collection = await Collection.findByPk(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthenticated' });
        }

        const { name, isOrganizationCollection, organizationId } = req.body;
        const orgCollection = await OrganizationCollection.findOne({ where: { collectionId: collection.id } });

        if (orgCollection) {
            collection.name = name;
            collection.isOrganizationCollection = isOrganizationCollection;
            collection.organizationId = organizationId;
            await collection.save();

            orgCollection.collectionId = collection.id;
            orgCollection.organizationId = organizationId;
            await orgCollection.save();

            return res.status(201).json({ message: "Organization collection updated successfully", data: collection});
        }

        collection.name = name;
        collection.isOrganizationCollection = isOrganizationCollection;
        collection.organizationId = organizationId;
        await collection.save();

        return res.status(200).json({ message: "collection updated successfully", data: collection });

    } catch (error) {
        return res.status(500).json({ error: error.message, message: "An error occurred while updating the collection" });
    }
};




exports.getCollections = async (req, res) => {
    if (req.user) {
        try {
            const user = await User.findByPk(req.user.id);
            if (user) {
                const collections = await Collection.findAll({ where: { userId: req.user.id } });
                res.json(collections);
            } else {
                res.json({message: "No such user!!"});
            }
            
        } catch (error) {
            res.status(500).json({ error: error.message,message: "invalid Token" });
        }

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }
};


exports.deleteCollection = async (req, res) => {
    if (req.user) {
        try {
            const collection = await Collection.findByPk(req.params.id);
            if (collection.userId !== req.user.id) {
                return res.sendStatus(403);
            }
            const orgCollection = await OrganizationCollection.findOne({ where: { collectionId: collection.id } });
            if (orgCollection) {
                await collection.destroy();
                await orgCollection.destroy();
                return res.status(200).json({ message: 'Organization Collection deleted successfully' });
            }
            await collection.destroy();
            res.status(200).json({ message: 'Collection deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message,message: "invalid Token" });
        }

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }
};

