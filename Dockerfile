FROM node:20-alpine

# OpenSSL Install
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm install && npx prisma generate

COPY . . 

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
