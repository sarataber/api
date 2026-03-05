# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build



EXPOSE 3000

CMD ["node", "dist/src/main.js"]