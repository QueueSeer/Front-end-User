FROM node:alpine
RUN apk update && apk add git
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install md5
COPY . .
EXPOSE 5173
CMD [ "npm","run","dev" ]
