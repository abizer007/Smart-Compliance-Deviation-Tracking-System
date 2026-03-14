FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY server ./server
COPY database/prisma ./database/prisma

WORKDIR /app/server

RUN npm install

RUN npm run build

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]

