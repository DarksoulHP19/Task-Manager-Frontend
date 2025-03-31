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
COPY --from=build /app/build .  
     

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
# ====== END ======
