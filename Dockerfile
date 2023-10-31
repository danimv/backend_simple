# syntax=docker/dockerfile:1
FROM node:12-alpine
#RUN apk add --no-cache python3 g++ make
RUN apk add --no-cache python3 g++ make \
    && mkdir -p /home/app
WORKDIR /home/app

COPY . .

RUN yarn install --production
#CMD ["node", "src/app.js"]
CMD ["node", "app.js"]
EXPOSE 5010

# FROM node:12-alpine
# RUN apk add --no-cache python3 g++ make

# COPY . .
# RUN yarn install --production
# CMD ["node", "app.js"]
# EXPOSE 5010

