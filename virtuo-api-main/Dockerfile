# Stage 1: Build the application
FROM node:20 AS builder

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

# Copy all the application files
COPY . .

# Build the application
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Production image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy built application and node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose the application port
EXPOSE 4001

# Start the application
CMD ["sh", "-c", "source .env && npm run start:prod"]