FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM nginx:alpine

COPY --from:build /app/dist/angular-starter/browser /usr/share/nginix/html

EXPOSE 80

CMD ["nginix", "-g", "daemon off;"]

