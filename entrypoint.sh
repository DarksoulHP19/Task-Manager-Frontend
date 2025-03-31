#!/bin/sh

# Replace placeholder with runtime environment variable
echo "Injecting environment variables..."
envsubst '${VITE_API_BASE_URL}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp    # <-- Environment injection
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

# Start NGINX
exec nginx -g "daemon off;"
