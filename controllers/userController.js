const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Organization = require('../models/organization');
const OrganizationUser = require('../models/organization_user');
const dotenv = require('dotenv');

require('dotenv').config({ path: `${process.cwd()}/.env` });
dotenv.config();

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(409).json({ errors });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.login = async (req, res) => {
    try { 
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign( {id: user.id ,email: user.email, role: user.role},process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id;  
        const { username, email, password } = req.body;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



// exports.deleteUser = async (req, res) => {
//     try {
//         const userId = req.user.id; 
//         const user = await User.findByPk(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         if (user.id === req.user.id) {
//             await user.destroy();
//             res.json({ message: 'User deleted successfully', user });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };



exports.profile = async (req,res) => {
    if (req.user) {
        try { 
            const user = await User.findByPk(req.user.id);
            if (user.id !== req.user.id) {
                return res.sendStatus(403);
            }

            res.render('profile.ejs',{name: user.username, email: user.email});
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }


    } else {
        res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });    
    }

}