FROM node:15.13-alpine3.10

WORKDIR /usr/src/app

COPY . .
RUN npm install --production

EXPOSE 8000
