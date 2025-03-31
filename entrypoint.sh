#!/bin/sh

# Replace placeholder with the runtime environment variable
envsubst '${VITE_API_BASE_URL}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

# Start NGINX
exec nginx -g "daemon off;"
