const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Organization = require('./organization');
const Collection = require('./collection');

const OrganizationCollection = sequelize.define('OrganizationCollection', {
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Organization,
            key: 'id'
        }
    },
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Collection,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

Organization.belongsToMany(Collection, { through: OrganizationCollection, foreignKey: 'organizationId' });
Collection.belongsToMany(Organization, { through: OrganizationCollection, foreignKey: 'collectionId' });

module.exports = OrganizationCollection;
