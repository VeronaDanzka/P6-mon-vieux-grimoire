const mongoose = require('mongoose');

const password = encodeURIComponent(process.env.MONGO_PASSWORD);

async function connectToMongoDB() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${password}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`);
        
        console.log('Connexion à MongoDB réussie !');
    } catch (error) {
        console.error('Connexion à MongoDB échouée !', error);
        process.exit(1);
    }
}

module.exports = connectToMongoDB;




