# CloudPrune Multi-Arch Production Dockerfile
FROM node:24-alpine AS runner

WORKDIR /app

COPY package.json ./
COPY core/ ./core/
COPY ee/ ./ee/
COPY LICENSE ./
COPY PRICING.md ./

RUN chmod +x ./core/src/cli.js
RUN ln -s /app/core/src/cli.js /usr/local/bin/cloudprune

USER node

ENTRYPOINT ["node", "core/src/cli.js"]
CMD ["scan"]
