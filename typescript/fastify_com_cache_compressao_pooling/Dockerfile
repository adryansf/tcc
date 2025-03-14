# Etapa de build
FROM node:22.14 AS build

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app
RUN npm run build

# Etapa de produção
FROM node:22.14 

WORKDIR /app

COPY package*.json /app/
RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/main.js"]
