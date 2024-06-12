const express = require('express');
const dotenv = require('dotenv');
const morgan =require('morgan');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const OrganizationUser = require('./models/organization_user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[web]'));
app.use(morgan('1- :remote-addr 2-[:date[clf]] 3-[:date[iso]] 4-[:date[web]] 5- :method 6- :url 7- :http-version 8- :status 9- :res[content-length] 10- :referrer 11- :user-agent 12- :response-time ms 13- :req[header]'));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const userRoutes = require('./routes/users');
const collectionRoutes = require('./routes/collections');
const bookmarkRoutes = require('./routes/bookmarks');
const fileRoutes = require('./routes/files');
const tagRoutes = require('./routes/tags');
const organizationRoutes = require('./routes/organizations');
const adminRoutes = require('./routes/admins');

app.use('/users', userRoutes);
app.use('/collections', collectionRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/files', fileRoutes);
app.use('/tags', tagRoutes);
app.use('/organizations', organizationRoutes);
app.use('/admin', adminRoutes);

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    return done(null, profile);
}));



app.get('/', (req, res) => {
    res.send(`<h1>Hello</h1>
        <a href="/auth/google">Authenticate with Google</a>
    `);
});


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile','email'] })
);
const User = require('./models/user');

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        await res.redirect('/createProfile');
    }
);

app.get('/createProfile', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    const name = req.user.displayName;
    const email = req.user.emails[0].value;
    let user = await User.findOne({ where: { email } });
    if (!user) {
        user = await User.create({ username: req.user.displayName, email: req.user.emails[0].value, password: req.user.photos[0].value });
    }
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token: jwtToken ,name: req.user.displayName});
});


app.post('/accept-invitation', async (req, res) => {
    try {
        const { token } = req.query; 

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { email, organizationId } = decoded; 

        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({username: email, email: email, password: 'defaultpassword' });
        }

        const organizationUser = await OrganizationUser.findOne({
            where: { organizationId, userId: user.id }
        });

        if (!organizationUser) {
            await OrganizationUser.create({
                organizationId,
                userId: user.id,
                });
            
            }
            
        const jwttoken = jwt.sign( {id: user.id ,email: user.email},process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({ message: 'Invitation accepted',jwtToken:  jwttoken});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

