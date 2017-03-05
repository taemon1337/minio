FROM node

RUN npm install express busboy minio

COPY ./ /web

WORKDIR /web

ENV PORT=8080

CMD node run.js
