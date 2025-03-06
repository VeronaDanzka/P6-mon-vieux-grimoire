const { body, oneOf, validationResult } = require('express-validator');

const parseBookData = (req, res, next) => {
    try {
        // Vérifier si book existe dans req.body
        if (!req.body.book && !req.body) {
            return res.status(400).json({ message: "Les champs sont manquants" });
        } else if(req.body.book){
            req.body.book = JSON.parse(req.body.book);
        }
        next();
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const validateBookForm = [
    parseBookData, 
    oneOf([
        body('userId').isString().withMessage("Format userId invalide"),
        body('book.userId').isString().withMessage("Format book.userId invalide")
    ]),
    oneOf([
        body('title').isString().withMessage("Format title invalide"),
        body('book.title').isString().withMessage("Format book.title invalide")
    ]),
    oneOf([
        body('author').isString().withMessage("Format author invalide"),
        body('book.author').isString().withMessage("Format book.author invalide")
    ]),
    oneOf([
        body('year')
            .isInt({ max: new Date().getFullYear() })
            .withMessage("Format year invalide"),
        body('book.year')
            .isInt({ max: new Date().getFullYear() })
            .withMessage("Format book.year invalide")
    ]),
    oneOf([
        body('genre').isString().withMessage("Format genre invalide"),
        body('book.genre').isString().withMessage("Format book.genre invalide")
    ]),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateBookForm;