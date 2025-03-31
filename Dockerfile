# ====== BUILD STAGE ======
# Build phase
FROM node:alpine3.21 AS build

WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json ./

RUN npm install 

# Copy the app files
COPY . .

# Add environment variables during build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the frontend
RUN npm run build

# Serve with NGINX
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default HTML files
RUN rm -rf ./*

# Copy build files from the build phase
COPY --from=build /app/dist .  

# Copy nginx configuration and entrypoint script
COPY ./nginx.conf /etc/nginx/conf.d/default.conf    
COPY ./entrypoint.sh /usr/bin/entrypoint.sh         
RUN chmod +x /usr/bin/entrypoint.sh      

EXPOSE 80

# Copy NGINX configuration file
ENTRYPOINT [ "usr/bin/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
# ====== END ======
