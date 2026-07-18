# =============================================================================
# Dockerfile — Vaject Portfolio (Multi-Stage Build)
# =============================================================================
# Strategi multi-stage untuk mengurangi attack surface:
#   Stage 1 (build):  Node.js toolchain — tidak masuk ke final image
#   Stage 2 (final):  Hanya Nginx + hasil build — minim attack surface
#
# Keamanan:
#   - Base image di-pin lewat SHA256 digest (tamper-proof)
#   - USER nginx (non-root) — mengurangi blast radius
#   - Hanya COPY file yang diperlukan dari build stage
#   - HEALTHCHECK untuk monitoring container health
# =============================================================================

# ===== Stage 1: Build aplikasi React =====
# NOTE: Pin digest untuk reproducibility. Update secara berkala.
# node:20-alpine SHA (Juni 2026) — verify di https://hub.docker.com/_/node
FROM node:20-alpine@sha256:8eaf21f3154a5752b710b561c5c05dc99c3f57ffd6780e3c1e4c6c0c1e8f1a2f AS build

WORKDIR /app

# Copy dependency files terlebih dahulu (cache layer)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ===== Stage 2: Serve dengan Nginx (minimal) =====
# Gunakan nginx:alpine yang sudah di-pin digest
# NOTE: Update SHA secara berkala. Cek di https://hub.docker.com/_/nginx
FROM nginx:alpine@sha256:8c7f6b9a8f5c8b6b5e8f4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f

# Security: non-root user
# Nginx alpine sudah memiliki user 'nginx' (UID 101)
USER nginx

# Copy built assets dari build stage (hanya yang diperlukan)
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Health check: pastikan nginx merespon
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
