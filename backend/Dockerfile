FROM node:15.4.0

WORKDIR /app

COPY ["package.json", "package-lock.json", "/app"]

RUN npm install

COPY . /app

CMD ["npm", "start"]

EXPOSE 5000