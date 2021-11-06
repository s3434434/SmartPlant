FROM node:14 as build
WORKDIR /usr/src/Demeter
COPY . ./
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /usr/src/Demeter/build /usr/share/nginx/html/Demeter
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]