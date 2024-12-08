FROM node:latest

RUN mkdir -p /home/app

RUN npm install

WORKDIR /home/app

EXPOSE 5000

CMD ["npm", "run", "prod"]