const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
require('dotenv').config({ path: `${process.cwd()}/.env` });
dotenv.config();

const sendInvitationEmail = async (email, token) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.FROM,
            pass: process.env.APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.FROM,
        to: email,
        subject: 'You are invited to join an organization',
        text: `Please accept the invitation by clicking the following link: ${process.env.APP_URL}/accept-invitation?token=${token}`
    };
//Please accept the invitation by clicking the following link: http://localhost:3000/accept-invitation?token=some-unique-token
    await transporter.sendMail(mailOptions);
};

module.exports = sendInvitationEmail;
