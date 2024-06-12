const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');

const File = sequelize.define('File', {
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
    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

User.hasMany(File, { foreignKey: 'userId', onDelete: 'CASCADE'});
File.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE'});

module.exports = File;
