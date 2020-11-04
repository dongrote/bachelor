FROM node:12-alpine AS server-builder
WORKDIR /usr/src/app
COPY api/package.json .
RUN npm i

FROM node:12-alpine
RUN mkdir -p /var/run/assets/images
RUN apk add openssl
WORKDIR /usr/src/app
COPY api/ .
COPY --from=server-builder /usr/src/app/ .
RUN rm -rf .env webui
CMD npm start
