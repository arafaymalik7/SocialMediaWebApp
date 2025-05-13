FROM node:18

WORKDIR /app

# Install socket.io
RUN npm init -y && npm install socket.io

# Copy socket server file
COPY index.js .

# Expose port
EXPOSE 8800

# Run the socket server
CMD ["node", "index.js"]