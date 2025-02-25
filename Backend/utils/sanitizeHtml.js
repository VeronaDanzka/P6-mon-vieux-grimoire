const sanitizeHtml = require('sanitize-html');

const sanitizeObject = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = sanitizeHtml(obj[key]);
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            sanitizeObject(obj[key]); // Appel récursif pour les objets imbriqués
        }
    }
    return obj;
};

module.exports = sanitizeObject;