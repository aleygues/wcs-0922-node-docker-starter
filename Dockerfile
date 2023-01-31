FROM node:alpine

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY src src
COPY tsconfig.json tsconfig.json
COPY tests tests
COPY jest.config.js jest.config.js

# RUN tsc

CMD yarn start


