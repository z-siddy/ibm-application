FROM node:10-alpine
WORKDIR /web
COPY package.json /web
RUN npm install
COPY . /web
CMD node server.js
EXPOSE 5000