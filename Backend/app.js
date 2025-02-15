const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const {connectToMongoDB} = require('./data/database');

// connexion à la base de données
(async () => { 
    await connectToMongoDB();
})();

const app = express();
app.use(express.json()); 

// Gestion des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/auth/signup', async (req, res, next) => {
    try{
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash,
        })
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch(error) {
        res.status(500).json({ error });
    }
});

app.post('/api/auth/login', async (req, res, next) => {
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
                    token: 'TOKEN'                                      
                });
            }
        }
    } catch(error) {
        res.status(500).json({ error });
    }
});

module.exports = app;