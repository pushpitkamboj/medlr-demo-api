# Use Node.js base image
FROM node:18

# Create a new user with UID 1000
RUN useradd -m -u 1000 user

# Set environment variables
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory
WORKDIR $HOME/app

# Switch to the new user
USER user

# Upgrade npm to avoid permission issues and ensure compatibility
RUN npm install -g npm@latest

# Copy package.json and package-lock.json with ownership to the new user
COPY --chown=user:user package*.json ./

# Install dependencies
RUN npm install --no-cache --silent
RUN npm run build

# Copy the remaining application code and set ownership
COPY --chown=user:user . .

# Set permissions for potential writable directories (e.g., logs, uploads)
RUN mkdir -p logs uploads && \
    chown -R user:user logs uploads

# Expose the application port
EXPOSE 7860

# Command to run the application
CMD ["npm", "start"]
