const express = require('express');
const {connectToMongoDB} = require('./data/database');
const userRoutes = require('./routes/user');
require('dotenv').config();

// connexion à la base de données
(async () => { 
    await connectToMongoDB();
})();

const app = express();
app.use(express.json()); 

// Gestion des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth/', userRoutes);

module.exports = app;