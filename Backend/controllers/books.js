const Books = require('../models/book');
const fs = require('fs').promises;

exports.getAllBooks = async (req, res, next) => {
    try{
        const books = await Books.find();
        if(books.length === 0){
            return res.status(404).json({ message: 'Aucuns livres trouvés' });
        } else {            
            return res.status(200).json(books);
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

exports.getOneBook = async (req, res, next) => {
    try {
        const book = await Books.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: 'Aucun livre trouvé' });
        } else {
            return res.status(200).json(book);
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

exports.createBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book); // changement de la chaîne string renvoyé par multer en objet
    delete bookObject._id;
    delete bookObject._userId; // suppression de l'id utilisateur envoyé par le client pour utiliser celui du token
    try {
        const book = new Books({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        await book.save();
        return res.status(201).json({ message: 'Livre créé !' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error });
        } else {
            return res.status(500).json({ error });
        }
    }
};

exports.modifyBook = async (req, res, next) => {
    try {
        const book = await Books.findOne({ _id: req.params.id });
        const fileName = book.imageUrl.split('/images/')[1]; // récupération du nom du fichier image
        // verification que l'utilisateur est bien le propriétaire du livre
        if(req.auth.userId !== book.userId){
            return res.status(401).json({ message: 'Utilisateur non autorisé' });
        } else {
            delete req.body.userId; // suppression de l'id utilisateur envoyé par le client pour utiliser celui du token
            const bookObject = req.file ? // si une image est envoyée
                {
                    ...JSON.parse(req.body.book),
                    userId: req.auth.userId,
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body, userId: req.auth.userId }; // si aucune image n'est envoyée
            
                await Books.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
                if(req.file){
                    await fs.unlink(`images/${fileName}`); // suppression de l'ancienne image
                }
                return res.status(200).json({ message: 'Livre modifié !' });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Books.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: 'Aucun livre trouvé' });
        }else{
            const fileName = book.imageUrl.split('/images/')[1]; // récupération du nom du fichier image
            // verification que l'utilisateur est bien le propriétaire du livre 
            if(req.auth.userId !== book.userId){
                return res.status(401).json({ message: 'Utilisateur non autorisé !' });
            } else {
                await Books.deleteOne({ _id: req.params.id }); // suppression du livre
                await fs.unlink(`images/${fileName}`); // suppression de l'image
                return res.status(200).json({ message: 'Livre supprimé !' });
            }
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

exports.ratingBook = async (req, res, next) => {
    try {
        const book = await Books.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: 'Aucun livre trouvé' });
        }
        const userRating = book.ratings.find(rating => rating.userId === req.auth.userId);
        if (userRating) {
            return res.status(400).json({ message: 'Note déjà attribuée !' });
        }
        if(req.body.rating < 0 || req.body.rating > 5){
            return res.status(400).json({ message: 'Note invalide !' });
        }
        book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });
        const newAverageRating = Math.round(book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / book.ratings.length);
        // récupération du livre mis à jour
        const updatedBook = await Books.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { ratings: book.ratings, averageRating: newAverageRating } },
            { new: true, runValidators: true } 
        );
        return res.status(200).json(updatedBook); // Retourne le livre mis à jour
    } catch (error) {
        return res.status(500).json({ error });
    }
}

exports.bestRatingBooks = async (req, res, next) => {
    try {
        const books = await Books.find().sort({ averageRating: -1 }).limit(3);
        if(books.length === 0){
            return res.status(404).json({ message: 'Aucuns livres trouvés' });
        } else {            
            return res.status(200).json(books);
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}