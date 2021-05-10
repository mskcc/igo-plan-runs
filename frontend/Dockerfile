FROM node:15.4.0

ADD . /app

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000
