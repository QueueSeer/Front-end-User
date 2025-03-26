FROM node:alpine
RUN apk update && apk add git bash curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    . ~/.nvm/nvm.sh && \
    nvm install 18.14.2 && \
    nvm use 18.14.2

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm","run","dev" ]
