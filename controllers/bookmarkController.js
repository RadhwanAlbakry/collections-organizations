const Bookmark = require('../models/bookmark');
const Collection = require('../models/collection');
const Tag = require('../models/tag');

exports.createBookmark = async (req, res) => {
    if (req.user) {
        try {
            const collection = await Collection.findOne({
                where: {
                    id: req.body.collectionId,
                    userId: req.user.id
                }
            });

            if (collection) {
                const bookmark = await Bookmark.create({
                    title: req.body.title,
                    url: req.body.url,
                    description: req.body.description,
                    collectionId: req.body.collectionId
                });
                res.status(201).json(bookmark);
            } else {
                res.status(401).json({message: 'Unauthorized to create this bookmark'});
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }
};

exports.getBookmarks = async (req,res) => {
    if(req.user) {
        const collectionId = req.params.collectionId;
        const userId = req.user.id;
        try {
            const bookmarks = await Bookmark.findAll({
              where: {
                collectionId: collectionId,
              },
              include: [
                {
                  model: Collection,
                  as: 'Collection',
                  where: {
                    userId: userId,
                  },
                  attributes: [], 
                },
              ],
            });
        
            if (bookmarks.length === 0) {
              return res.status(404).json({ message: 'No bookmarks found for the given collectionId and userId' });
            }
        
            res.status(200).json(bookmarks);
          } catch (error) {
            res.status(500).json({ error: error.message, message: "An error occurred while fetching bookmarks OR Invalid Token" });
          }

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

};

exports.updateBookmark = async (req, res) => {
    if (req.user) {
        try {
            const updates = req.body;
            const bookmark = await Bookmark.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: Collection,
                        as: 'Collection',
                    },
                ],
            });
    
            if (!bookmark) {
                return res.status(404).json({ message: 'Bookmark not found' });
            }
    
            if (bookmark.Collection.userId !== req.user.id) {
                return res.status(401).json({ message: 'Unauthorized to update this bookmark' });
            }
            Object.assign(bookmark, updates);
        
            await bookmark.save();
            res.status(200).json({ message: 'Bookmark updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message, message: 'An error occurred while deleting the bookmark' });
        }

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

};


exports.deleteBookmark = async (req, res) => {
    if(req.user) {
        try {
            const bookmark = await Bookmark.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: Collection,
                        as: 'Collection',
                    },
                ],
            });
    
            if (!bookmark) {
                return res.status(404).json({ message: 'Bookmark not found' });
            }
    
            if (bookmark.Collection.userId !== req.user.id) {
                return res.status(401).json({ message: 'Unauthorized to delete this bookmark' });
            }
    
            await bookmark.destroy();
            res.status(200).json({ message: 'Bookmark deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message, message: 'An error occurred while deleting the bookmark' });
        }

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

};
