import mongoose from 'mongoose';

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

export default mongoose.model('User', userSchema);