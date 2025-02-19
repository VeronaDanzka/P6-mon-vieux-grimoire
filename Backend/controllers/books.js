const Books = require('../models/book');

exports.getAllBooks = async (req, res, next) => {
    try{
        const books = await Books.find();
        if(books.length === 0){
            res.status(400).json({ message: 'Aucuns livres trouvés' });
        } else {            
            res.status(200).json(books);
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.getOneBook = async (req, res, next) => {
    try {
        const book = await Books.findOne({ _id: req.params.id });
        if (!book) {
            res.status(404).json({ message: 'Aucun livre trouvé' });
        } else {
            res.status(200).json(book);
        }
    } catch (error) {
        res.status(500).json({ error });
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
        res.status(201).json({ message: 'Livre créé !' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error });
        } else {
            res.status(500).json({ error });
        }
    }
};

exports.modifyBook = async (req, res, next) => {
    try {
        const book = await Books.findOne({ _id: req.params.id });
        // verification que l'utilisateur est bien le propriétaire du livre
        if(req.auth.userId !== book.userId){
            res.status(401).json({ message: 'Utilisateur non autorisé' });
        } else {
            delete req.body.userId; // suppression de l'id utilisateur envoyé par le client pour utiliser celui du token
            const bookObject = req.file ? // si une image est envoyée
                {
                    ...JSON.parse(req.body.book),
                    userId: req.auth.userId,
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body, userId: req.auth.userId }; // si aucune image n'est envoyée
            
                await Books.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
                res.status(200).json({ message: 'Livre modifié !' });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};