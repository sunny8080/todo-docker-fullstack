# This dockerfile will be used for production build purpose
FROM node:26-alpine
WORKDIR /app

# --chown means change the ownership of the files
# --chown=USER:GROUP

# provide ownership to non-root user, better security 
COPY --chown=node:node package*.json .

# omit installing dev dependency packages, faster installation
RUN npm ci --omit=dev

# provide ownership to non-root user, better security 
COPY --chown=node:node . .

# change user as earlier used non-root user
USER node

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm","start"]
