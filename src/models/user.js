const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    link: String,
    solved: Number,
});

module.exports = mongoose.model('User', userSchema);