FROM node:14.18.1-alpine

WORKDIR /app

# COPY ["package.json", "package-lock.json*", "./"]

# RUN npm ci

RUN npm install pm2 -g

ENV NODE_ENV = production

COPY . .

WORKDIR /app/tmmtmm

RUN yarn

RUN yarn build

# EXPOSE 3000/tcp

# runtime for docker
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
