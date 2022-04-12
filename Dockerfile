# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache --virtual .gyp python3 make g++
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "app.js"]
