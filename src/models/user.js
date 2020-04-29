const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: String,
    name: String,
    link: String,
    solved: Number,
});

module.exports = mongoose.model('User', userSchema);