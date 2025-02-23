const { body, validationResult } = require('express-validator');

const validateUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail()
        .custom((value) => {
            if (typeof value !== 'string') {
                throw new Error("Format email invalide");
            }
            return true;
        }),
    body('password')
        .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
        .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
        .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
        .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateUser;