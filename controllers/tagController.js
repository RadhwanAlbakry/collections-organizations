const Bookmark = require('../models/bookmark');
const Tag = require('../models/tag');
const Collection = require('../models/collection');

exports.createTag = async (req, res) => {
  if (req.user) {
      try {
          const bookmark = await Bookmark.findOne({
              where: {
                  id: req.body.bookmarkId,
              }
          });
          const bookCollection = bookmark.collectionId;
          if (bookCollection) {
            const collection = await Collection.findOne({
              where: {
                  id: bookCollection,
                  userId: req.user.id
              }
            });

            if (collection) {
              const tag = await Tag.create({
                  name: req.body.name,
                  bookmarkId: req.body.bookmarkId,
              });
              res.status(201).json(tag);
            } else {
              res.status(403).json({ error: "You are not authorized to add a tag to this bookmark" });
            }


          } 

      } catch (error) {
          res.status(500).json({message: "the data are not valid", error: error.message });
      }
  } else {
    res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
  }
};



exports.getAllTags = async (req,res) => {
  if(req.user) {
    try {
      const bookmarks = await Bookmark.findOne({
        where: {
          id: req.params.bookmarkId,
        }});
        if (bookmarks) {
          const tags = await Tag.findAll({
            where: {
              bookmarkId: req.params.bookmarkId,
            },
            include: [
              {
                model: Bookmark,
                as: 'Bookmark',
                where: {
                  collectionId: bookmarks.collectionId,
                },
                attributes: [],
                include: [
                  {
                    model: Collection,
                    as: 'Collection',
                    where: {
                      id: bookmarks.collectionId,
                      userId: req.user.id
                    },
                    attributes: [],
                  }
                ]
              },
            ],
          });
      
          if (tags.length === 0) {
            return res.status(404).json({ message: 'No tags found for the given bookmarkId and userId' });
          }
      
          res.status(200).json(tags);
  
        }
      } catch (error) {
        res.status(500).json({ error: error.message, message: "An error occurred while fetching bookmarks OR Invalid Token" });
      }

  } else {
    res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
  }

};


exports.deleteTag = async (req, res) => {
  if(req.user) {
    try {
      const tag = await Tag.findOne({
          where: { id: req.params.id },
          include: [
              {
                  model: Bookmark,
                  as: 'Bookmark',
                  include: [
                      {
                          model: Collection,
                          as: 'Collection',
                      },
                  ],
              },
          ],
      });

      if (!tag) {
          return res.status(404).json({ message: 'Tag not found' });
      }

      if (tag.Bookmark.Collection.userId !== req.user.id) {
          return res.status(403).json({ message: 'Unauthorized to delete this tag' });
      }

      await tag.destroy();
      res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'An error occurred while deleting the tag' });
    }

  } else {
    res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
  }

};


exports.updateTag = async (req, res) => {
  if(req.user) {
    try {
      const updates = req.body;
      const tag = await Tag.findOne({
          where: { id: req.params.id },
          include: [
              {
                  model: Bookmark,
                  as: 'Bookmark',
                  include: [
                      {
                          model: Collection,
                          as: 'Collection',
                      },
                  ],
              },
          ],
      });

      if (!tag) {
          return res.status(404).json({ message: 'Tag not found' });
      }

      if (tag.Bookmark.Collection.userId !== req.user.id) {
          return res.status(401).json({ message: 'Unauthorized to update this tag' });
      }

      Object.assign(tag, updates);

      data = await tag.save();
      res.status(200).json({ message: 'Tag updated successfully',data: data });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'An error occurred while updating the tag' });
    }

  } else {
    res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
  }
};
