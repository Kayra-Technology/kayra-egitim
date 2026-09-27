# syntax=docker/dockerfile:1

# ---- test: lint + unit + build + e2e inside Playwright's pinned browser image ----
FROM mcr.microsoft.com/playwright:v1.63.0-noble AS test
ENV CI=1
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run lint \
 && npm test \
 && npm run build \
 && npx playwright test

# ---- web: static production build served by nginx ----
FROM nginx:1.29-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=test /app/dist /usr/share/nginx/html
EXPOSE 80
