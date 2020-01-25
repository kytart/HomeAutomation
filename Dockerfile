FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN mkdir /data
ENV PERSIST_SETTINGS_PATH '/data'
EXPOSE 8080
CMD [ "npm", "start" ]
