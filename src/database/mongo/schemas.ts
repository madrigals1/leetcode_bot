import * as mongoose from 'mongoose';

export interface IUserModel extends mongoose.Document {
  username: string;
}

// MongoDB collection schemas
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

// MongoDB models
const UserModel = mongoose.model<IUserModel>('User', userSchema);

export default UserModel;
