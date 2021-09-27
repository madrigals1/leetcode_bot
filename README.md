# Leetcode Bot
Leetcode Bot is an app, that gets data for **LeetCode Users** and creates **Rating of Users.**

```
1. madrigals1 506
2. makhmudgaly2 247
3. pheonix97al 231
4. megasaab 132
```

**LeetCode BOT** is available on 3 platforms:
- **Telegram**
- **Discord**
- **Slack**

![Build Status](https://travis-ci.org/madrigals1/leetcode_bot.svg?branch=master)
![Coverage Status](https://coveralls.io/repos/github/madrigals1/leetcode_bot/badge.svg?branch=master)

You can create your own rating by deploying this project on your machine!!!

[Demo BOT on Telegram](https://t.me/dalbbot)

## Table of Contents

- [Commands](docs/Commands)
- [Installation](#Installation)
- [Running](#Running)
- [Testing](#Testing)
- [Authors](#Authors)

## Installation

> If you want to use [Docker](https://www.docker.com/), check this [tutorial](/docs/README-Docker.md).

### Prerequisites

Make sure you have installed these:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.

(Optional) If you are going to use **PostgreSQL** or **MongoDB**, you will have to install them:
- [PostgreSQL](https://www.postgresql.org/) - PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.
- [MongoDB](https://www.mongodb.com/) - MongoDB is a source-available cross-platform document-oriented database program.

> You can use **SQLite3** as Database, this way you will not have to install anything.

### Installation Steps

1. Make a copy of .env.example file named .env

    ```shell script
    cp .env.example .env
    ```

2. To enable specific chatbot, change respective values inside `.env`

    ```dotenv
    # Change TELEGRAM_TOKEN to your own token you get from https://t.me/botfather
    TELEGRAM_ENABLE=True
    TELEGRAM_TOKEN=****************************************

    # Change DISCORD_TOKEN to your own token you get from https://discord.com/developers/applications/
    DISCORD_ENABLE=False
    DISCORD_TOKEN=*****************************************
    
    # Change SLACK credentials to your own token you get from https://api.slack.com/apps
    SLACK_ENABLE=False
    SLACK_TOKEN=*******************************************
    SLACK_SIGNING_SECRET=**********************************
    SLACK_APP_TOKEN=***************************************
    SLACK_TEST_ENABLE=False
    SLACK_TEST_TOKEN=**************************************
    SLACK_TEST_SIGNING_SECRET=*****************************
    SLACK_TEST_APP_TOKEN=**********************************
    ```

3. Change **MASTER_PASSWORD** value to secure password, that will be used for deleting data.

    ```dotenv
    MASTER_PASSWORD=***************************************
    ```

4. Change settings for **Database**

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

5. Change submission count, that will be shown for each User - `/rating <username>`
    ```dotenv
    SUBMISSION_COUNT=5
    ```

6. Delay time is set to 4s, depends on LeetCode RPM.

    ```dotenv
    DELAY_TIME_MS=4000
    ```

7. Install npm packages

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

## Author
- Adi Sabyrbayev [Github](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)
