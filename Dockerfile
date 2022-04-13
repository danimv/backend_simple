# syntax=docker/dockerfile:1
FROM node:12-alpine
# RUN apk add --no-cache --virtual .gyp python3 make g++
RUN apt update && apt install -y apt-transport-https ca-certificates sqlite3
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "app.js"]
