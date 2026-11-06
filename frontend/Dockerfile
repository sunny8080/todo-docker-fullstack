# This dockerfile will be used for production build purpose
# Stage 1 - Build the react application
FROM node:26-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite embeds this value in the client bundle at build time.
ARG VITE_BED_URL=http://localhost:3000
ENV VITE_BED_URL=${VITE_BED_URL}
ENV NODE_ENV=production

RUN npm run build

# Stage 2 - serve the static built files with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
