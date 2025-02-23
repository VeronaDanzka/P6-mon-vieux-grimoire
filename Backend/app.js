const express = require('express');
const connectToMongoDB = require('./data/database');
const path = require('path');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/books');
const morgan = require("morgan");
const { logger, authLogger } = require("./utils/logger");

// connexion à la base de données
(async () => { 
    await connectToMongoDB();
})();

const app = express();
app.use(express.json()); // convertir le JSON en objet js pour accéder aux données

app.disable("x-powered-by"); // désactivation de l'information de l'utilisation d'Express pour plus de sécurité

// Journalisation de toutes les requêtes HTTP avec Winston + Morgan
app.use(morgan("combined", {
    stream: {
        write: (message) => logger.info(`[HTTP] ${message.trim()}`), // [HTTP] pour différencier des autres logs
        write: (message) => authLogger.info(`[HTTP] ${message.trim()}`) // [HTTP] pour différencier des autres logs
    }
}));


const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000'; // Valeur par défaut
// Gestion des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin); // limite l'accès à l'API via le navigateur
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('X-Content-Type-Options', 'nosniff'); // protection contre les attaques MIME
    next();
});

app.use('/api/auth/', userRoutes);
app.use('/api/books/', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // route pour afficher les images
module.exports = app;