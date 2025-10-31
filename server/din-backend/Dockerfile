# Dockerfile for DIN backend
FROM node:22-bullseye-slim
WORKDIR /usr/src/app

# Install dependencies first (use package.json from repo)
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy application
COPY . .

# Create a data dir if not provided
RUN mkdir -p /data
VOLUME ["/data"]

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
