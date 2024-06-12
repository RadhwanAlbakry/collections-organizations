const express = require('express');
const fileController = require('../controllers/fileController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname.split('.') + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', authenticateJWT,upload.single('file'),fileController.uploadFile);
router.get('/all', authenticateJWT,fileController.getFiles);
router.delete('/delete/:id', authenticateJWT, fileController.deleteFiles);


module.exports = router;