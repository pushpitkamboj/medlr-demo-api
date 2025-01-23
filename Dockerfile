# Base image
FROM node:18

# Create a new user with UID 1000
RUN useradd -m -u 1000 user

# Switch to the new user
USER user

# Set environment variables
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory
WORKDIR $HOME/app

# Copy package.json and package-lock.json, setting ownership to the new user
COPY --chown=user:user package*.json ./

# Install dependencies
RUN npm install
RUN npm run build

# Copy the rest of the application code, setting ownership to the new user
COPY --chown=user:user . .

# Expose the application port
EXPOSE 7860

# Command to run the application
CMD ["npm", "start"]
