# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:13-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./
COPY client/package*.json ./client/

# Install production dependencies.
RUN npm install --only=production
RUN cd client && npm install --only=production

# Copy local code to the container image.
COPY . ./

# Compile TypeScript
RUN npm run tsc
RUN cd client && npm build

# Run the web service on container startup.
CMD [ "npm", "run", "start:production" ]