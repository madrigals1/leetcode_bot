import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

const UserModel = mongoose.model('User', userSchema);

const subscriptionSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
  },
});

const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

export { UserModel, SubscriptionModel };
