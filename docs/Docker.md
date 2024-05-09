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

```bash
cp .env.example .env
```

To enable **Telegram BOT** or **Discord BOT**, change respective values inside `.env`

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

Change settings for Database

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

Delay time after loading each User is set to 4s, depends on LeetCode RPM.

```bash
USER_REQUEST_DELAY_MS=4000
```

Build **Docker Compose**

```bash
docker-compose up --build -d
```

Create database network with name **DATABASE_NETWORK**

```bash
docker network create database_network
```

> If you are using **MongoDB** or **PostgreSQL**, be sure to set up correct networking between **LeetCode BOT** container and DBMS instances.

## Running

To start Docker container

```bash
docker-compose up
```

To stop Docker container

```bash
docker-compose down
```
