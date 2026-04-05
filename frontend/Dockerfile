FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# We'll default to running dev if we are dynamically mapping volumes, or build for production
CMD ["npm", "run", "dev"]
