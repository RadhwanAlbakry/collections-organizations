const User = require('./models/user');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const admin = await User.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin', 10), 
      role: 'admin'
    });

    console.log('Admin user created:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();
