const fs = require('fs');
const File = require('../models/file');
const multer = require('multer');
const path = require('path');
const e = require('express');

exports.uploadFile = async (req, res) => {
    if(req.user) {
        try {
            const file = await File.create({ name: req.file.filename, userId: req.user.id });
            res.status(200).json({ message: 'File uploaded successfully', file: req.file });
        } catch (error) {
            res.status(400).json({ message: 'Error uploading file because the Token is Invalid', error: error.message });
        }
 
    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

};


exports.getFiles = async (req, res) => {
    if (req.user) {
        try {
            const files = await File.findAll({ where: { userId: req.user.id } });
            res.json(files);
                                                                                                    
        } catch (error) {
            res.status(500).json({ error: error.message, message: "Error getting files because the Token is Invalid"});
        }

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }
};

exports.deleteFiles = async (req, res) => {
    if (req.user) {
        try {
            const file = await File.findByPk(req.params.id);
            if (file.userId !== req.user.id) {
                return res.sendStatus(403);
            }
    
            const filePath = path.join(__dirname, '..', 'uploads', file.name);
                fs.unlink(filePath, async (err) => {
                    await file.destroy();
                    res.status(200).json({ message: 'File deleted successfully' });
                });
    
        } catch (error) {
            res.status(500).json({ error: error.message, message:"Error Deleting file because the Token is Invalid" });
        }       

    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }
};