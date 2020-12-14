FROM node:10-alpine3.10

WORKDIR /opt/referee

# Other dependencies
RUN apk add python make bash

COPY package.json yarn.lock lerna.json ./ 

RUN yarn
RUN yarn install
RUN yarn bootstrap

COPY . .

RUN npm rebuild node-sass

EXPOSE 3000
CMD yarn start
