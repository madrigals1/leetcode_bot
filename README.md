# Leetcode Bot
Leetcode Bot is an app, that gets data for **LeetCode Users** and creates **Rating of Users.**

```s
1. reed_w 2018
2. SysSn13 750
3. sandeep_padhi 736
4. alexduanran 672
5. danny1024 610
6. dmndcrow 607
7. madrigals1 607
8. shadow2000 578
9. Lesbek 419
10. makhmudgaly2 389
11. lalabhai18 368
12. user9678ch 366
13. pheonix97al 318
14. Ajink7 267
15. vishavjeet2710 255
16. ubtrnvme 182
17. megasaab 173
18. shahriarkabir44 115
19. yesseyev_mt 113
20. Lorem 57
21. poomrokc 49
22. zhanybekovv 44
23. meiirzhan_yerzhanov 20
24. ssskkk16 13
```

![Demo](https://i.imgur.com/tdg7Wwr.png)

**LeetCode BOT** is available on 3 platforms:
- **Telegram**
- **Discord**
- **Slack**

You can create your own rating by deploying this project on your machine!!!

- [Demo BOT on Telegram](https://t.me/l33tcode_bot)
- [Demo BOT on Discord](https://discord.gg/eHjKqR52)

## Table of Contents

- [Commands](docs/Commands.md)
- [Installation](#Installation)
- [Running](#Running)
- [Testing](#Testing)
- [Authors](#Authors)

## Installation

> If you want to use [Docker](https://www.docker.com/), check this [tutorial](/docs/Docker.md).

### Prerequisites

Make sure you have installed these:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.

(Optional) If you are going to use **PostgreSQL** or **MongoDB**, you will have to install them:
- [PostgreSQL](https://www.postgresql.org/) - PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.
- [MongoDB](https://www.mongodb.com/) - MongoDB is a source-available cross-platform document-oriented database program.

> You can use **SQLite3** as Database, this way you will not have to install anything.

### Installation Steps

1. Make a copy of `.env.example` file named `.env`

    ```bash
    cp .env.example .env
    ```

2. To enable specific chatbot, change respective values inside `.env`

    ```bash
    # Get token and bot name from https://t.me/botfather
    TELEGRAM_TOKEN=
    TELEGRAM_BOT_NAME=

    # Get values from https://discord.com/developers/applications
    DISCORD_TOKEN=
    DISCORD_APP_ID=
    DISCORD_GUILD_ID=

    # Get values from https://api.slack.com/apps
    SLACK_TOKEN=
    SLACK_SIGNING_SECRET=
    SLACK_APP_TOKEN=
    ```

3. Change settings for **Database**

    - **SQLite3** - no changes needed.

    - **MongoDB**
        ```bash
        MONGO_DB_URL=localhost
        MONGO_DB_NAME=leetbot_db
        MONGO_DB_AUTHENTICATION_ENABLED=True
        MONGO_DB_USER=admin
        MONGO_DB_PASSWORD=password
        MONGO_DB_PORT=27017
        ```

    - **PostgreSQL**
        ```bash
        POSTGRES_DB_URL=localhost
        POSTGRES_DB_NAME=leetbot_db
        POSTGRES_DB_USER=admin
        POSTGRES_DB_PASSWORD=password
        POSTGRES_DB_PORT=5432
        ```

4. Delay time after loading each User is set to 4s, depends on LeetCode RPM

    ```bash
    USER_REQUEST_DELAY_MS=4000
    ```

5. Install npm packages

    ```bash
    npm ci
    ```

## Running

```bash
npm start
```

## Testing

Regular testing

```bash
npm test
```

Testing with checking and creating test coverage. You can check coverage report
under `./coverage/lcov-report/index.html`

```bash
npm run test:coverage
```

## Authors
- Adi Sabyrbayev [Github](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)
