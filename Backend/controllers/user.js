const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res, next) => {
    try{
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch(error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error });
        } else {
            res.status(500).json({ error });
        }
    }
}; 

exports.connectUser = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            res.status(401).json({ message: 'paire identifiant / mot de passe incorrecte !' });
        } else {
            const valid = await bcrypt.compare(req.body.password, user.password)
            if(!valid){
                res.status(401).json({ message: 'paire identifiant / mot de passe incorrecte !' });
            } else {
                res.status(200).json({ 
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
        res.status(500).json({ error });
    }
};