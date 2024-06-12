const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Bookmark = require('./bookmark');

const Tag = sequelize.define('Tag', {
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  bookmarkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Bookmark,
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

Bookmark.hasMany(Tag, { foreignKey: 'bookmarkId', onDelete: 'CASCADE'});
Tag.belongsTo(Bookmark, { foreignKey: 'bookmarkId', onDelete: 'CASCADE' });

module.exports = Tag;
