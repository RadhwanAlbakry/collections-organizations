const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');
const Organization = require('./organization');

const OrganizationUser = sequelize.define('OrganizationUser', {
    organizationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Organization,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    role: {
        type: DataTypes.ENUM('owner', 'admin', 'member'),
        allowNull: false,
        defaultValue: 'member'
    }
}, {
    timestamps: true
});

User.belongsToMany(Organization, { through: OrganizationUser, foreignKey: 'userId' });
Organization.belongsToMany(User, { through: OrganizationUser, foreignKey: 'organizationId' });

module.exports = OrganizationUser;
