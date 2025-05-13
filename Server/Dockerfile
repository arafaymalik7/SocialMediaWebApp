FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all server files
COPY . .

# Expose the port your server runs on
EXPOSE 4000

# Start the server
CMD ["npm", "start"]