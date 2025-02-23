const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// definition du schema de données User
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email invalide"] }, // regex pour valider l'email
  password: { type: String, required: true, minlength: 8 }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);