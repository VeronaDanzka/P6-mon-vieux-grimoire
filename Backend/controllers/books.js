const Books = require('../models/book');

exports.getAllBooks = async (req, res, next) => {
    try{
        const books = await Books.find();
        if(books.length === 0){
            res.status(400).json({ message: 'No books found' });
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
            res.status(404).json({ message: 'No book found' });
        } else {
            res.status(200).json(book);
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
exports.createBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book); // changement de la chaîne en objet
    delete bookObject._id;
    delete bookObject._userId; // suppression de l'id utilisateur envoyé par le client
    try {
        const book = new Books({
            ...bookObject,
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