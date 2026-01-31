const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// HTML-Dateien mit dem EJS-Renderer verknüpfen
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Lesen von Formulardaten und wandeln in ein JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// Routing 
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
//const vaultRoutes = require('./routes/vaultRoutes');

app.use('/', indexRoutes);
//app.use('/', vaultRoutes);
app.use('/', authRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
