FROM node:18.14.2-alpine
RUN apk update && apk add git bash curl

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm","run","dev" ]
