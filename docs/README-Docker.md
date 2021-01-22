## Prerequisites

Make sure you have these:
- [Docker](https://www.docker.com/) - Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.
- [Docker Compose](https://www.docker.com/) - The Compose file provides a way to document and configure all of the application's service dependencies (databases, queues, caches, web service APIs, etc).

> On **Windows** and **MacOS**, Docker Compose is installed together with Docker. On Linux, it should be installed separately.


(Optional) If you are going to use **PostgreSQL** or **MongoDB**, you will have to install them:
- [PostgreSQL](https://www.postgresql.org/) - PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.
- [MongoDB](https://www.mongodb.com/) - MongoDB is a source-available cross-platform document-oriented database program.

> You can use **SQLite3** as Database, this way you will not have to install anything.


## Installation

Make a copy of `.env.example` file named `.env`

```shell script
cp .env.example .env
```

To enable **Telegram BOT** or **Discord BOT**, change respective values inside `.env`

```dotenv
# Change TELEGRAM_TOKEN to your own TELEGRAM_TOKEN you get from https://t.me/botfather
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

Change settings for Database

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

Build **Docker Compose**

```shell script
docker-compose up --build -d
```

> If you are using **MongoDB** or **PostgreSQL**, be sure to set up correct networking between **LeetCode BOT** container and DBMS instances.

## Running

To run Docker container

```shell script
docker-compose up
```

To stop Docker container

```shell script
docker-compose down
```