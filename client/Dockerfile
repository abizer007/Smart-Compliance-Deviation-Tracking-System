FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
COPY client ./client

WORKDIR /app/client

RUN npm install
RUN npm run build

FROM node:20-alpine AS serve

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/client/dist ./dist

ENV PORT=4173

CMD ["serve", "-s", "dist", "-l", "4173"]

