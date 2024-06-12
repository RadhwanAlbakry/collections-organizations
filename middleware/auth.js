
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('dotenv').config({ path: `${process.cwd()}/.env` });
dotenv.config();

const authenticateJWT = (req, res, next) => {
    const tokens = req.header('Authorization');
    const token = tokens && tokens.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,decoded) => {
            req.user = decoded;
            next();
        });
    } else {
        const message = "No Token";
        res.sendStatus(401, message);
    }
};

module.exports = authenticateJWT;
