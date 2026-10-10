# Avisos de la Liga · servicio privado, no forma parte de GitHub Pages.
# Railway: configura Root Directory = server/notifications.
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force
COPY index.mjs authorization.mjs ./
USER node
EXPOSE 8080
CMD ["node", "index.mjs"]
