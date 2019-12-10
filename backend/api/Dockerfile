FROM node

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Check for database container
COPY /scripts/wait-for-it.sh /bin/
RUN chmod +x /bin/wait-for-it.sh

# Expose port
EXPOSE 8080

# Start up app once database is built
ENTRYPOINT /bin/wait-for-it.sh -t 30 db:3306 && npm run dev