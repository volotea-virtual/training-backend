# Base Image
FROM node:lts-bullseye
WORKDIR /opt/trainingcenter_backend
ARG NODE_ENV=development
COPY package*.json ./
RUN npm install --quiet --unsafe-perm --no-progress --no-audit --include=dev
COPY . .
RUN npm run build
CMD npm run run