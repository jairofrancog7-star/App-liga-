FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY index.mjs rules.mjs ./
ENV PUSH_STATE_DIR=/data
# Railway monta el volumen como root. Ajustar solo la carpeta privada antes de
# cambiar a usuario sin privilegios para el servidor Node.
RUN apk add --no-cache su-exec && mkdir -p /data && chown -R node:node /app /data
EXPOSE 3000
CMD ["sh", "-c", "chown node:node /data && exec su-exec node node index.mjs"]
