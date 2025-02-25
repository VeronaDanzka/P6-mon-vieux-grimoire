const rateLimit = require("express-rate-limit");

const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Bloque après 5 tentatives
    message: {
        success: false,
        message: "Trop de tentatives de connexion. Réessayez plus tard.",
    },
    standardHeaders: true, // Retourne les headers "RateLimit-*"
    legacyHeaders: false, // Désactive les headers obsolètes
});

module.exports = loginLimit;
