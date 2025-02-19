const multer = require('multer');

// Définition des types MIME autorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// Filtrage des fichiers non-images
const fileFilter = (req, file, callback) => {
    if (!MIME_TYPES[file.mimetype]) {
      callback(new Error("Format de fichier non pris en charge. Veuillez envoyer une image JPG, PNG ou WEBP."), false);
    } else {
      callback(null, true);
    }
};

// Configuration de multer avec memoryStorage et fileFilter
const storage = multer.memoryStorage();

module.exports = multer({ 
  storage,
  fileFilter
}).single('image');


