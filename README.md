# Leetcode Bot
Leetcode Bot is a web scraper, that connects to Telegram or Discord Bot for creating Leetcode Rating.

You can create your own rating by adding Leetcode users.

If you want to use [Docker](https://www.docker.com/), check this [tutorial]().

## Demo

[Telegram BOT](https://t.me/dalbbot)

Main
![Main](https://i.imgur.com/7VRyBUV.png)

Submissions
![Submissions](https://i.imgur.com/KppSfUe.png)

Adding and Deleting
![Adding and Deleting](https://i.imgur.com/Q9CQH05.png)

## Prerequisites

Make sure you have installed these:
- [MongoDB]('https://www.mongodb.com/download-center') - cross-platform document-oriented database program. 
Classified as a NoSQL database program, MongoDB uses JSON-like documents with schema.
- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.

## Installation

Make a copy of .env.example file named .env

```shell script
cp .env.example .env
```

To enable **Telegram BOT** or **Discord BOT**, change respective values inside `.env`

```dotenv
# Change TELEGRAM_TOKEN to your own TELEGRAM_TOKEN you get from BotFather
TELEGRAM_ENABLE=True
TELEGRAM_TOKEN=****************************************

# Change DISCORD_TOKEN to your own token you get from https://discord.com/developers/applications/
DISCORD_ENABLE=True
DISCORD_TOKEN=*****************************************
```

Change **MASTER_PASSWORD** value to secure password, that will be used for deleting data.

```dotenv
MASTER_PASSWORD=***************************************
```

Change settings for **MongoDB**

```dotenv
MONGO_URL=localhost
DB_NAME=leetbot_db
DB_AUTHENTICATION_ENABLED=true
DB_USER=admin
DB_PASSWORD=password
DB_PORT=27017
```

Change submission count, that will be shown for each User
```dotenv
SUBMISSION_COUNT=5
```

Delay time is set to 4s, because LeetCode Rate-Limit is 15 RPM

```dotenv
DELAY_TIME_MS=4000
```

Install npm packages

```
npm ci
```

## Running

Run the MongoDB database

```shell script
mongod --auth
```

Open another terminal tab and run

```
npm start
```

### Author
- Adi Sabyrbayev [Github](https://github.com/Madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)