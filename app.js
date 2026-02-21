const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').default; // to save Session data in DB an not in Memory-Story
const path = require('path');


const app = express();
const PORT = 3000;

// 1. Datenbank Verbindung (Nur EINE Verbindung für alles)
const dbUrl = 'mongodb://localhost:27017/bitburgDB';           

mongoose.connect(dbUrl)
    .then(() => console.log('Mongoose verbunden!'))
    .catch(err => console.error('Datenbankfehler:', err));
         
// View Engine        
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware für Body Parsing (Nur einmal nötig!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Session Konfiguration
// Wir speichern die Sessions einfach in der gleichen DB in der Collection 'sessions'
app.use(session({
  secret: 'geheimes-wort', 
  resave: false,     
  saveUninitialized: false, // WICHTIG: Erstellt Session erst, wenn Daten (Login) da sind
  store: MongoStore.create({
    mongoUrl: dbUrl, // Nutzt die gleiche URL wie Mongoose
    collectionName: 'sessions', // Name der Collection in MongoDB
    ttl: 12 * 60 * 60 // Session läuft nach 12 Stunden in der DB ab
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 12, // 12h TTL
    httpOnly: true // Sicherheit: Client-JS kann Cookie nicht lesen
  }            
}));

// Routing 

app.use(require('./routes'));



app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});      