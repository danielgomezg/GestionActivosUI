# FASE DE CONSTRUCCION.
# FROM node:16.16.0
FROM node:18-alpine3.18 AS build

WORKDIR /app

COPY package.json package-lock.json /app/
COPY . /app/

RUN npm install

RUN npm run build

# CMD ["npm", "run", "dev"]

# FASE DE PRODUCCION.
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]