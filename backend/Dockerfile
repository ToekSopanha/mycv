# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# Copy the rest of the backend source
COPY . .

# Pre-create the data and uploads directories so Docker volumes mount cleanly
# and the runtime has writable targets from the first request.
RUN mkdir -p /app/data /app/uploads

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server.js"]
