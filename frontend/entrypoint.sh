#!/bin/sh
set -e

# Let's Encrypt bootstrap + auto-renewal for the frontend container.
# The HTTP-01 challenge requires port 80 to be reachable from the internet
# and the domain to already resolve to this host before first boot.

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "ERROR: DOMAIN and EMAIL environment variables must be set"
  exit 1
fi

if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "Obtaining SSL certificate for $DOMAIN..."
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL" --no-eff-email
else
  echo "SSL certificate already exists for $DOMAIN"
fi

# Start nginx in the background. Entrypoint stays in the foreground so the
# container keeps running; the renewal loop below also blocks forever.
nginx

# Renewal loop — check every 12 hours (43200 seconds).
while true; do
  echo "Checking for SSL certificate renewal..."
  certbot renew --quiet --nginx
  sleep 43200
done
