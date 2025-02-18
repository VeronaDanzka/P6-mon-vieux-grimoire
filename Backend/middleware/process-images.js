const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
module.exports = async (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ message: "Erreur lors du traitement de l'image." });
  }
  try {
    if (!MIME_TYPES.includes(req.file.mimetype)) {
      res.status(400).json({ message: "Format d'image non pris en charge." });
    }
    else {
      const filename = req.file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, ""); // Supprime l'extension d'origine
      const newFilename = `${filename}_${Date.now()}.webp`;
      const outputPath = path.join('images', newFilename); // Chemin final de sauvegarde

      // Traitement de l'image avec sharp directement depuis buffer
      await sharp(req.file.buffer)
        .resize({ width: 2000 }) // Redimensionne
        .toFormat('webp') // Convertir en WebP
        .webp({ quality: 80 }) // Compression WebP optimisée
        .toFile(outputPath);

      // Met à jour req.file avec le fichier final
      req.file.filename = newFilename;
      req.file.path = outputPath;

      next();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
