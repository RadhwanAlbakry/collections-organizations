const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Username already in use!'
        },
        validate: {
            notNull: {
                msg: 'Username is required'
            },
            notEmpty: {
                msg: 'Username cannot be empty'
            },
            len: {
                args: [4, 20],
                msg: 'Username must be between 4 and 20 characters long'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Email already in use!'
        },
        validate: {
            notNull: {
                msg: 'Email is required'
            },
            notEmpty: {
                msg: 'Email cannot be empty'
            },
            isEmail: {
                msg: 'Must be a valid email address'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required'
            },
            notEmpty: {
                msg: 'Password cannot be empty'
            },
            len: {
                args: [8, 100],
                msg: 'Password must be at least 8 characters long'
            },
            // isStrongPassword(value) {
            //     // Custom validation for password strength
            //     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            //     if (!passwordRegex.test(value)) {
            //         throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            //     }
            // }
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'member'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
});


module.exports = User;
