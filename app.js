const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const PORT = 3000;

// HTML-Dateien mit dem EJS-Renderer verknüpfen
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
  secret: 'geheimes-wort', // Kann irgendwas sein
  resave: false,
  saveUninitialized: false
}));

// Lesen von Formulardaten und wandeln in ein JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// In app.js
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'views'))); // Füge dies hinzu


//Verbindung mit MongoDB
mongoose.connect('mongodb://localhost:27017/bitburgDB')
    .then(() => console.log('Mongoose verbunden!'))
    .catch(err => console.error('Datenbankfehler:', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Routing 
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
//const vaultRoutes = require('./routes/vaultRoutes');

app.use('/', indexRoutes);
//app.use('/', vaultRoutes);
app.use('/', authRoutes);
app.use('/', walletRoutes);




// Start server
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
