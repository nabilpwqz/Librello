FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma compatibility on Alpine Linux
RUN apk add --no-cache openssl libc6-compat

# Copy package descriptors
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN npm install
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 8000

# Push database schema & start application
CMD ["sh", "-c", "npx prisma db push && npm run dev"]
