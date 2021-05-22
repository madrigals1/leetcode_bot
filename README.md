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

### Start

Starting page that contains links to all other actions

| Name | Start |
| --- | --- |
| Arguments | - |
| Telegram | Yes |
| Discord | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/start` | ![Start](https://i.imgur.com/EDZk84y.png) | 

---

### Rating

Prints out rating of users if called without args and data for specific user if called with args.

| Name | Rating |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode. If specified, bot will get data of this specific User and print out. |
| Telegram | Yes |
| Discord | Limited |
| Admin | No |

| Request | Response |
| --- | --- |
| `/rating` | ![Rating](https://i.imgur.com/56qWPO7.png) |
| `/rating username` | ![Rating username](https://i.imgur.com/mjHCA9X.png) | 

---

### Add

Takes list of Users separated by whitespaces. Saves usernames into Database. Loads data of these Users from LeetCode and saves it into Cache.

| Name | Add |
| --- | --- |
| Arguments | [1+] `username ...` - usernames of Users in LeetCode |
| Telegram | Yes |
| Discord | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/add username1 username2 ...` | ![Add username1 username2](https://i.imgur.com/oibWs44.png) |

---

### Avatar

Returns avatar of User from LeetCode as image

| Name | Avatar |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode |
| Telegram | Yes |
| Discord | Limited |
| Admin | No |

| Request | Response |
| --- | --- |
| `/avatar` | ![Avatar](https://i.imgur.com/UVMvVOo.png) |
| `/avatar username` | ![Avatar username](https://i.imgur.com/spGTNmN.png) |

---

### Submissions

Gets submission data of User, converts that data into visualization using [VizAPI](https://github.com/madrigals1/vizapi). Returns visualization as image.

| Name | Submissions |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode |
| Telegram | Yes |
| Discord | Limited |
| Admin | No |

| Request | Response |
| --- | --- |
| `/submissions` | ![Submissions](https://i.imgur.com/FHo6fta.png) |
| `/submissions username` | ![Submissions username](https://i.imgur.com/5yotx36.png) |

---

### Compare

Creates small comparison visualization between 2 users using [VizAPI](https://github.com/madrigals1/vizapi). Returns visualization as image.

| Name | Compare |
| --- | --- |
| Arguments | [1] `username1` - username of User in LeetCode |
| | [2] `username2` - username of User in LeetCode |
| Telegram | Yes |
| Discord | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/compare username1 username2` | ![Compare](https://i.imgur.com/UlYzT2n.png) |

---

### Refresh

Manual refresh of database. By default, database is refreshed once in 15 minutes.

| Name | Refresh |
| --- | --- |
| Arguments | - |
| Telegram | Yes |
| Discord | Yes |
| Admin | No |

| Request | Response |
| --- | --- |
| `/refresh` | ![Refresh](https://i.imgur.com/Mmcyv7P.png) |

---

### Remove

Admin action, that removes specified User from Database and Cache

| Name | Remove |
| --- | --- |
| Arguments | [1] `username` - username of User in LeetCode |
| | [2] `master_password` - MASTER_PASSWORD, specified in .env |
| Telegram | Yes |
| Discord | Yes |
| Admin | Yes |

| Request | Response |
| --- | --- |
| `/remove madrigals1 password` | ![Remove](https://i.imgur.com/SvwimOi.png) |

---

### Clear

Admin action, that clears Database and Cache from all Users

| Name | Clear |
| --- | --- |
| Arguments | [1] `master_password` - MASTER_PASSWORD, specified in .env |
| Telegram | Yes |
| Discord | Yes |
| Admin | Yes |

| Request | Response |
| --- | --- |
| `/clear password` | ![Clear](https://i.imgur.com/SvwimOi.png) |

---

### Stats

Admin action, that shows some lets us see some part of data, only accessible by admins directly on the server.

| Name | Stats |
| --- | --- |
| Arguments | [1] `master_password` - MASTER_PASSWORD, specified in .env |
| Telegram | Yes |
| Discord | Yes |
| Admin | Yes |

| Request | Response |
| --- | --- |
| `/stats password` | ![Stats](https://i.imgur.com/JvvOSa8.png) |

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

2. To enable **Telegram BOT** or **Discord BOT**, change respective values inside `.env`

    ```dotenv
    # Change TELEGRAM_TOKEN to your own token you get from https://t.me/botfather
    TELEGRAM_ENABLE=True
    TELEGRAM_TOKEN=****************************************

    # Change DISCORD_TOKEN to your own token you get from https://discord.com/developers/applications/
    DISCORD_ENABLE=False
    DISCORD_TOKEN=*****************************************
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
