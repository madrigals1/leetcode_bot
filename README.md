# Leetcode Bot
Leetcode Bot is an app, that gets data for **LeetCode Users** and creates **Rating of Users.**

```
1. madrigals1 506
2. makhmudgaly2 247
3. pheonix97al 231
4. megasaab 132
```

**Telegram BOT** or **Discord BOT** are used to display this rating.

You can create your own rating by deploying this project on your machine!!!

[Demo BOT on Telegram](https://t.me/dalbbot)

## Table of Contents

- [Functionality](#Functionality)
- [Installation](#Installation)
- [Running](#Running)
- [Testing](#Testing)
- [Authors](#Authors)

## Functionality

`/start`

![Start](https://i.imgur.com/EDZk84y.png)

`/rating`

![Rating](https://i.imgur.com/56qWPO7.png)

`/rating username`

![Rating username](https://i.imgur.com/mjHCA9X.png)

`/add username1 username2 ...`

![Add username1 username2](https://i.imgur.com/oibWs44.png)

`/avatar username`

![Avatar username](https://i.imgur.com/spGTNmN.png)

`/submissions username`

![Submissions username](https://i.imgur.com/5yotx36.png)

## Installation

> If you want to use [Docker](https://www.docker.com/), check this [tutorial](/docs/README-Docker.md).

### Prerequisites

Make sure you have installed these:
Classified as a NoSQL database program, MongoDB uses JSON-like documents with schema.
- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.

(Optional) If you are going to use **PostgreSQL** or **MongoDB**, you will have to install them:
- [PostgreSQL](https://www.postgresql.org/) - PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.
- [MongoDB](https://www.mongodb.com/) - MongoDB is a source-available cross-platform document-oriented database program.

> You can use **SQLite3** as Database, this way you will not have to install anything.

Make a copy of .env.example file named .env

```shell script
cp .env.example .env
```

To enable **Telegram BOT** or **Discord BOT**, change respective values inside `.env`

```dotenv
# Change TELEGRAM_TOKEN to your own token you get from https://t.me/botfather
TELEGRAM_ENABLE=True
TELEGRAM_TOKEN=****************************************

# Change DISCORD_TOKEN to your own token you get from https://discord.com/developers/applications/
DISCORD_ENABLE=False
DISCORD_TOKEN=*****************************************
```

Change **MASTER_PASSWORD** value to secure password, that will be used for deleting data.

```dotenv
MASTER_PASSWORD=***************************************
```

Change settings for **Database**

- **SQLite3** - no changes needed.

- **MongoDB**
    ```dotenv
    MONGO_DB_URL=localhost
    MONGO_DB_NAME=leetbot_db
    MONGO_DB_AUTHENTICATION_ENABLED=True
    MONGO_DB_USER=admin
    MONGO_DB_PASSWORD=password
    MONGO_DB_PORT=27017
    ```

- **PostgreSQL**
    ```
    POSTGRES_DB_URL=localhost
    POSTGRES_DB_NAME=leetbot_db
    POSTGRES_DB_USER=admin
    POSTGRES_DB_PASSWORD=password
    POSTGRES_DB_PORT=5432
    ```

Change submission count, that will be shown for each User - `/rating <username>`
```dotenv
SUBMISSION_COUNT=5
```

Delay time is set to 4s, depends on LeetCode RPM, which I don't know.

```dotenv
DELAY_TIME_MS=4000
```

Install npm packages

```
npm ci
```

## Running

```
npm start
```

## Testing

```
npm test
```

## Authors
- Adi Sabyrbayev [Github](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)
- Aibek Ziyashev [Github](https://github.com/dmndcrow), [LinkedIn](https://www.linkedin.com/in/aibek-ziyashev-11b744193/)