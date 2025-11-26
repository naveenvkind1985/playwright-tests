FROM node:18-alpine

# Install Playwright dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY playwright.config.ts ./

# Install dependencies
RUN npm ci

# Copy test files
COPY tests/ ./tests/

# Install Playwright browsers
RUN npx playwright install

# Use root user to avoid permission issues (for development)
# USER root

# Default command
CMD ["npx", "playwright", "test", "--reporter=html,line"]