const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,  'views'));

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
