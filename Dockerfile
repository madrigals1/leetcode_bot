FROM node:15.13-alpine3.10

# Install required packages
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 make gcc g++ libc-dev \
    && ln -sf python3 /usr/bin/python

WORKDIR /usr/src/app

COPY . .
RUN npm ci

EXPOSE 8000
