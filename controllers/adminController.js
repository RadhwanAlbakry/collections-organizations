const { Sequelize } = require('sequelize');
const sequelize = require('../models/index'); 
const User = require('../models/user');
const Organization = require('../models/organization');
const OrganizationUser = require('../models/organization_user');

exports.getOrganizationsAndMembersCount = async (req, res) => {
    try {
        const organizationsCount = await Organization.count();

        const organizationsWithMembers = await Organization.findAll({
            include: [{
                model: User,
                attributes: [], 
                through: {
                    attributes: [] 
                }
            }],
            attributes: {
                include: [[sequelize.fn('COUNT', sequelize.col('Users.id')), 'membersCount']]
            },
            group: ['Organization.id', 'Organization.name'] 
        });

        const organizations = organizationsWithMembers.map(org => ({
            id: org.id,
            name: org.name,
            membersCount: org.get('membersCount')
        }));

        res.status(200).json({ organizationsCount, organizations });
    } catch (error) {
        console.error('Error fetching organization and member counts:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.deleteUser = async (req, res) => {
    if (!req.user) {
      return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.destroy();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    if (!req.user) {
      return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
    }

    try {
      const users = await User.findAll();
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
};

exports.getAllOrganizations = async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: "Forbidden", message: "Access is forbidden" });
  }

  try {
    const organizations = await Organization.findAll();
    res.status(200).json({ organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ error: error.message });
  }
};