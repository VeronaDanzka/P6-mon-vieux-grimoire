const express = require('express');
const connectToMongoDB = require('./data/database');
const path = require('path');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/books');


// connexion à la base de données
(async () => { 
    await connectToMongoDB();
})();

const app = express();
app.use(express.json()); // convertir le JSON en objet js pour accéder aux données

// Gestion des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth/', userRoutes);
app.use('/api/books/', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // route pour afficher les images
module.exports = app;