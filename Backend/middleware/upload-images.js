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

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

module.exports = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "Erreur Multer : " + err.message,
      });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};


