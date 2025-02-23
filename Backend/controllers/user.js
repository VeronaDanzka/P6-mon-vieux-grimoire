const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { authLogger } = require('../utils/logger');


exports.createUser = async (req, res, next) => {
    try{
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        await user.save();
        authLogger.info(`Utilisateur créé: ${user.email}`);
        return res.status(201).json({ message: 'Utilisateur créé !' });
    } catch(error) {
        if (error.name === 'ValidationError') {
            authLogger.error(`Erreur dans createUser: ${error.message}`);
            return res.status(400).json({ error });
        } else {
            authLogger.error(`Erreur dans createUser: ${error.message}`);
            return res.status(500).json({ error });
        }
    }
}; 

exports.connectUser = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user){            
            authLogger.error(`Utilisateur non trouvé: ${req.body.email}`);
            return res.status(401).json({ message: 'paire identifiant / mot de passe incorrecte !' });
        } else {
            const valid = await bcrypt.compare(req.body.password, user.password)
            if(!valid){
                authLogger.error(`Mot de passe incorrect pour l'utilisateur: ${req.body.email}`);
                return res.status(401).json({ message: 'paire identifiant / mot de passe incorrecte !' });
            } else {
                authLogger.info(`Utilisateur connecté: ${user.email} avec id ${user._id}`);
                return res.status(200).json({ 
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }                                      
                    )
                });
            }
        }
    } catch(error) {
        authLogger.error(`Erreur dans connectUser: ${error.message}`);
        return res.status(500).json({ error });
    }
};