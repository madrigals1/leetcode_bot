import mongoose from 'mongoose';

// MongoDB collection schemas
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

// MongoDB models
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
