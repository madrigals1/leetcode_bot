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

![Coverage Status](https://coveralls.io/repos/github/madrigals1/leetcode_bot/badge.svg?branch=master)

You can create your own rating by deploying this project on your machine!!!

[Demo BOT on Telegram](https://t.me/dalbbot)

## Table of Contents

- [Functionality](#Functionality)
- [Installation](#Installation)
- [Running](#Running)
- [Testing](#Testing)
- [Authors](#Authors)

## Functionality

### Start

Starting page that contains links to all other actions.

| Name | Start |
| --- | --- |
| Arguments | - |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/start` | ![Start](https://i.imgur.com/fxH0iad.png) | 

---

### Rating

Prints out rating of Users.

| Name | Rating |
| --- | --- |
| Arguments | - |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/rating` | ![Rating](https://i.imgur.com/GM26BLT.png) |

---

### Profile

Prints data of Users, that inclues:
- User's real name
- Link, that leads to User's profile in LeetCode
- Amount of solved problems in different levels of difficulty

| Name | Profile |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode. |
| Telegram | Yes |
| Discord | Limited |
| Slack | Limited |
| Admin | No |

| Request | Response |
| --- | --- |
| `/profile` | ![Profile](https://i.imgur.com/ui2FvMu.png) |
| `/profile username` | ![Profile username](https://i.imgur.com/JGdSsNb.png) | 

---

### Add

Takes list of Users separated by whitespaces. Saves usernames into Database. Loads data of these Users from LeetCode and saves it into Cache.

| Name | Add |
| --- | --- |
| Arguments | [1+] `username ...` - usernames of Users in LeetCode |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/add username1 username2 ...` | ![Add username1 username2](https://i.imgur.com/ahSSzry.png) |

---

### Avatar

Returns avatar of User from LeetCode as image

| Name | Avatar |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode |
| Telegram | Yes |
| Discord | Limited |
| Slack | Limited |
| Admin | No |

| Request | Response |
| --- | --- |
| `/avatar` | ![Avatar](https://i.imgur.com/AnMGzQK.png) |
| `/avatar username` | ![Avatar username](https://i.imgur.com/7yeNN0l.png) |

---

### Submissions

Gets submission data of User, converts that data into visualization using [VizAPI](https://github.com/madrigals1/vizapi). Returns visualization as image.

| Name | Submissions |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode |
| Telegram | Yes |
| Discord | Limited |
| Slack | Limited |
| Admin | No |

| Request | Response |
| --- | --- |
| `/submissions` | ![Submissions](https://i.imgur.com/f5RlHRM.png) |
| `/submissions username` | ![Submissions username](https://i.imgur.com/PWUYubx.png) |

---

### Compare

Creates small comparison visualization between 2 users using [VizAPI](https://github.com/madrigals1/vizapi). Returns visualization as image.

| Name | Compare |
| --- | --- |
| Arguments | [1] `username1` - username of User in LeetCode |
| | [2] `username2` - username of User in LeetCode |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/compare` | ![Compare](https://i.imgur.com/vsvynWh.png) |
| `/compare username1` | ![Compare username1](https://i.imgur.com/oZqdnKn.png) |
| `/compare username1 username2` | ![Compare username1 username2](https://i.imgur.com/bUPH7Df.png) |

---

### Refresh

Manual refresh of database. By default, database is refreshed once in 15 minutes.

| Name | Refresh |
| --- | --- |
| Arguments | - |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/refresh` | ![Refresh](https://i.imgur.com/rn9ppHD.png) |

---

### Remove

Admin action, that removes specified User from Database and Cache

| Name | Remove |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode |
| | [2] `master_password` - MASTER_PASSWORD, specified in .env |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | Yes |

| Request | Response |
| --- | --- |
| `/remove password` | ![Remove](https://i.imgur.com/kbuzG4O.png) |
| `/remove madrigals1 password` | ![Remove](https://i.imgur.com/2SvP59r.png) |

---

### Clear

Admin action, that clears Database and Cache from all Users

| Name | Clear |
| --- | --- |
| Arguments | [1] `master_password` - MASTER_PASSWORD, specified in .env |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | Yes |

| Request | Response |
| --- | --- |
| `/clear password` | ![Clear](https://i.imgur.com/5L9PS8X.png) |

---

### Stats

Admin action, that shows some lets us see some part of data, only accessible by admins directly on the server.

| Name | Stats |
| --- | --- |
| Arguments | [1] `master_password` - MASTER_PASSWORD, specified in .env |
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Admin | Yes |

| Request | Response |
| --- | --- |
| `/stats password` | ![Stats](https://i.imgur.com/lFWBTmE.png) |

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
