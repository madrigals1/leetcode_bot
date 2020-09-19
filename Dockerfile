FROM node:12-alpine
 
WORKDIR /usr/src/app

COPY . .
RUN npm ci

EXPOSE 8000

CMD [ "npm", "start" ]
