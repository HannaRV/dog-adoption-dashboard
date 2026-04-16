FROM node:22.14.0-slim AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22.14.0-slim
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY src/ ./src/
EXPOSE 3000
ENV NODE_ENV=production
USER node
CMD ["node", "src/app.js"]