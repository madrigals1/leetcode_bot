FROM node:12-alpine

# Install required packages
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 make gcc g++ libc-dev \
    && ln -sf python3 /usr/bin/python

WORKDIR /usr/src/app

COPY . .
RUN npm ci

EXPOSE 8000
