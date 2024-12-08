FROM node:latest

RUN mkdir -p /home/app

WORKDIR /home/app

EXPOSE 5000

CMD ["npm", "run", "prod"]