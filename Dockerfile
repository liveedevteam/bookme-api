FROM node:9.4.0-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock /app/
COPY build /app/build
RUN yarn install --production