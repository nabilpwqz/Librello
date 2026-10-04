FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application sources
COPY . .

# Expose Next.js port
EXPOSE 3000

# Set environment defaults
ENV PORT=3000
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Start Next.js development server
CMD ["npm", "run", "dev"]
