# Use the official Node.js image as the base image
FROM node:18-alpine
WORKDIR /app

COPY package.json ./
RUN npm install
COPY .next ./.next
COPY public ./public

EXPOSE 3000
CMD ["npm", "start"]