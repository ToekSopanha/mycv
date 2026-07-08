# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (including dev deps needed by Vite)
COPY package*.json ./
RUN npm install && npm cache clean --force

# Build the Vue app
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine

# Install Certbot and the nginx plugin for Let's Encrypt
RUN apk add --no-cache certbot certbot-nginx

# Replace the default nginx site with our SPA + reverse-proxy config.
# Certbot's nginx plugin will append the 443 server block once a
# certificate is issued, so this file only needs to be valid on port 80.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Certbot state and issued certificates live here
RUN mkdir -p /etc/letsencrypt

# Entrypoint script handles certificate bootstrap + renewals
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]
