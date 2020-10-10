## Prerequisites

Make sure you have these:
- [Docker](https://www.docker.com/) - Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.
- [Docker Compose](https://www.docker.com/) - The Compose file provides a way to document and configure all of the application's service dependencies (databases, queues, caches, web service APIs, etc).

> On **Windows** and **MacOS**, Docker Compose is installed together with Docker. On Linux, it should be installed separately.

## Installation

Make a copy of `.env.example` file named `.env`

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

Build **Docker Compose**

```shell script
docker-compose up --build -d
```

**MongoDB** instance should be up in the same network, which is `mongodb_docker_default`. Rename as you want.

## Running

To run Docker container

```shell script
docker-compose up
```

To stop Docker container

```shell script
docker-compose down
```