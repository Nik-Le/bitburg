const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,  'views'));

// Lesen von Formulardaten und wandeln in ein Java-Objekt
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log('--- DEBUG INFO ---');
    console.log('Methode:', req.method); // Zeigt GET oder POST
    console.log('Formular-Daten (Body):', req.body); // Zeigt deine Eingaben
    console.log('------------------');
    
    // WICHTIG: next() sagt dem Server "Mach weiter mit den Routen"
    // Ohne next() bleibt die Seite ewig laden.
    next();
});

// Routing 
const indexRoutes = require('./routes/indexRoutes');
//const authRoutes = require('./routes/authRoutes');
//const vaultRoutes = require('./routes/vaultRoutes');

app.use('/', indexRoutes);
//app.use('/', vaultRoutes);
//app.use('/', authRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
