# Use the official Node.js image with the correct version
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source files to the working directory
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Set the default command to run the application
CMD ["node", "index.js"]
