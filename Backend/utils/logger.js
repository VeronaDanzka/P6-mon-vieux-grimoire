const { createLogger, transports, format } = require("winston");
const path = require("path");
const fs = require("fs");

// 🔹 Vérifie et crée le dossier logs
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// 🔥 Logger principal (Général)
const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDirectory, "error.log"), level: "error" }),
        new transports.File({ filename: path.join(logDirectory, "combined.log") }),
    ]
});

// 🔥 Logger spécifique pour l'authentification
const authLogger = createLogger({
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [AUTH]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDirectory, "auth.log")}),
        new transports.File({ filename: path.join(logDirectory, "combined.log") })
    ]
});

module.exports = { logger, authLogger };
