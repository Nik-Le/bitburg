const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').default;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbUrl = 'mongodb://localhost:27017/bitburgDB';

/**
 * Initialize database connection.
 */
mongoose.connect(dbUrl)
    .then(() => console.log('Mongoose connected!'))
    .catch(err => console.error('Database connection error:', err));

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.set('trust proxy', 1);
/**
 * Session configuration.
 * Stores session data in MongoDB to persist across server restarts.
 */
app.use(session({
    secret: 'geheimes-wort', // TODO: Use environment variable in production
    resave: false,     
    saveUninitialized: false, // Creates session only after data is added (e.g., login)
    store: MongoStore.create({
        mongoUrl: dbUrl,
        collectionName: 'sessions',
        ttl: 12 * 60 * 60 // 12 hours
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: false
    }            
}));

// Initialize routes
app.use(require('./routes'));

/**
 * Start the server.
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});