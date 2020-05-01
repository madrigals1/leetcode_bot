import dotenv from 'dotenv';

dotenv.config();
const token = process.env.TOKEN;
const mongoURL = process.env.MONGO_URL ? 'mongo' : 'localhost';

export { token, mongoURL };