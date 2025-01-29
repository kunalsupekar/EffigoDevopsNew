# Use the latest LTS version of Node.js
FROM node:18-alpine

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .



# Expose the port (3000 is React's default)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
