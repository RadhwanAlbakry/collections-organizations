const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');

const Collection = sequelize.define('Collection', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    isOrganizationCollection:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

User.hasMany(Collection, { foreignKey: 'userId', onDelete: 'CASCADE' });
Collection.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Collection;
