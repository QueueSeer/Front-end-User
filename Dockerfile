FROM node:20.9.0-alpine
RUN apk update && apk add git bash curl

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm","run","dev" ]
