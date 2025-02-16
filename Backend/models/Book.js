const mongoose = require('mongoose');

// definition du schema de donnée Book
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true},
    title: { type: String, required: true},
    author: { type: String, required: true},
    imageUrl: { type: String, required: true},
    year: { type: String, required: true},
    ratings: [
        {
          userId: { type: String, required: true }, // ID de l'utilisateur qui a noté
          grade: { type: Number, required: true, min: 0, max: 5 } // Note entre 0 et 5
        }
      ],
    averageRating: { type: Number, default: 0 } // Note moyenne initialisée à 0
})

module.exports = mongoose.model('Book', bookSchema);