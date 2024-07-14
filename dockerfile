FROM node:latest

WORKDIR /dis

COPY package*.json ./

# Instala todas las dependencias, incluyendo las devDependencies
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/index.js"]