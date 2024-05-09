## Prerequisites

Make sure you have these:
- [Docker](https://www.docker.com/) - Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.
- [Docker Compose](https://www.docker.com/) - The Compose file provides a way to document and configure all of the application's service dependencies (databases, queues, caches, web service APIs, etc).

> On **Windows** and **MacOS**, Docker Compose is installed together with Docker. On Linux, it should be installed separately.


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

Create database network with name inside **DATABASE_NETWORK** variable.

```bash
docker network create database_network
```

Build and Run using **Docker Compose**

```bash
docker-compose up --build -d
```

## Running

To start Docker container

```bash
docker-compose up
```

To stop Docker container

```bash
docker-compose down
```
