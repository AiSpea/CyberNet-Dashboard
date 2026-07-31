ARG NODE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginx:1.28-alpine

FROM ${NODE_IMAGE} AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache curl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN ./scripts/fetch-ironrdp.sh \
    && printf '{}\n' > .local-config.json

ARG DASHBOARD_VERSION=development
ENV NEXT_PUBLIC_DASHBOARD_VERSION=${DASHBOARD_VERSION}
RUN npm run build

FROM ${NGINX_IMAGE} AS runtime

RUN rm -f /etc/nginx/conf.d/default.conf

COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/init_react_envs.sh /docker-entrypoint.d/40-cybernet-config.sh
COPY --from=builder /app/out/ /usr/share/nginx/html/

RUN chmod 0755 /docker-entrypoint.d/40-cybernet-config.sh

STOPSIGNAL SIGQUIT
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1/healthz || exit 1
