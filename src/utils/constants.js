import { mongoURL } from './config';

const url = 'https://leetcode.com/';
const database = 'leetbot_db';
const port = 27017;
const welcome_message = `Welcome! This is Leetcode Rating bot Elite Boys.
<b><i>/rating</i></b> - Overall rating
<b><i>/refresh</i></b>  - Manual refresh of database.
<b><i>/add username1 username2</i></b>  ... - adding users`;
const server = `${mongoURL}:${port}`;

export { url, database, server, welcome_message };
