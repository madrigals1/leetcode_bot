# Leetcode Bot
Project for checking ratings of users in Leetcode

## Prerequisites

Make sure you have installed these:
- [MongoDB]('https://www.mongodb.com/download-center') - cross-platform document-oriented database program. 
Classified as a NoSQL database program, MongoDB uses JSON-like documents with schema.
- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Yarn](https://classic.yarnpkg.com/en/) - package manager for node.js.

## Installation
1) Make a copy of .env.example file named .env
```
cp .env.example .env
```
2) Inside `.env` file change TELEGRAM_TOKEN variable value to token you get from [BotFather](https://telegram.me/BotFather "BotFather")
```
# Change TELEGRAM_TOKEN to your own token you get from BotFather
TELEGRAM_TOKEN=**************************
```
3) Run
```
yarn install
```

## Running
- Open terminal and run, don't close this terminal tab
```
mongod
```
- Open another terminal tab and run
```
yarn start
```

### Author
- Adi Sabyrbayev [Github](https://github.com/Madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)

### Contributors
- Aibek Ziyashev [Github](https://github.com/dmndcrow), [LinkedIn](https://www.linkedin.com/in/dmndcrow)