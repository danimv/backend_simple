# syntax=docker/dockerfile:1
FROM node:12-alpine

ENV NODE_ENV=production
WORKDIR /app
RUN npm install --production
# RUN apk add --no-cache --virtual .gyp python3 make g++
# RUN apk install -y apk-transport-https ca-certificates sqlite3

COPY . .
# RUN yarn install --production

EXPOSE 5000
CMD ["npm", "app.js"]
