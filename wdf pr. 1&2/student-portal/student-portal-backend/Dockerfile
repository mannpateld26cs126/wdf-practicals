FROM node:18-alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

COPY . .
RUN npm run build

EXPOSE 4000
CMD ["node", "dist/index.js"]
