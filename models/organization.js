const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Collection = require('./collection');
const Organization = sequelize.define('Organization', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Organization name cannot be empty"
            },
            len: {
                args: [1, 255],
                msg: "Organization name must be between 1 and 255 characters"
            }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: "Description must be no longer than 500 characters"
            }
        }
    },
}, {
    timestamps: true
});
module.exports = Organization;
