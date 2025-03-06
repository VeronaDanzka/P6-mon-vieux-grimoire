const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

module.exports = async (req, res, next) => {
  if (!req.files && req.method === 'POST') {
    return res.status(400).json({ message: "Image de couverture requise" });
  }
  if (!req.files && req.method === 'PUT') {
    return next();
  }
  try {
      const filename = req.files.image[0].originalname.split(' ').join('_').replace(/\.[^/.]+$/, ""); // Supprime l'extension d'origine
      const newFilename = `${filename}_${Date.now()}.webp`;
      const outputPath = path.join('images', newFilename); // Chemin final de sauvegarde

      await fs.mkdir('images', { recursive: true }) // créer le dossier image s'il n'existe pas

      // Traitement de l'image avec sharp directement depuis buffer
      await sharp(req.files.image[0].buffer)
        .resize({ height: 1000 }) // Redimensionne
        .toFormat('webp') // Convertir en WebP
        .webp({ quality: 80 }) // Compression WebP optimisée
        .toFile(outputPath);

    // Met à jour req.files.image[0] avec le fichier final
    req.files.image[0].filename = newFilename;
    req.files.image[0].path = outputPath;

      next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
