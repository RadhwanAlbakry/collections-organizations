const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Collection = require('./collection');

const Bookmark = sequelize.define('Bookmark', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Title cannot be empty"
            },
            len: {
                args: [1, 255],
                msg: "Title must be between 1 and 255 characters"
            }
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "URL cannot be empty"
            },
            isUrl: {
                msg: "Must be a valid URL"
            }
        }
    },
    description: {
        type: DataTypes.STRING
    },
    collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Collection,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },  
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});


Collection.hasMany(Bookmark, { foreignKey: 'collectionId', onDelete: 'CASCADE'});
Bookmark.belongsTo(Collection, { foreignKey: 'collectionId', onDelete: 'CASCADE' });

module.exports = Bookmark;
