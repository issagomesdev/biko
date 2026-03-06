FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG NODE_ENV=production

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 3000

CMD if [ "$NODE_ENV" = "production" ]; then npm start; else npm run dev; fi