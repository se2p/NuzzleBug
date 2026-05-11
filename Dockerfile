FROM docker.io/library/node:24 AS builder

ARG SCRATCHLOG_BASE_URL="http://localhost:8089"
ARG LITTERBOX_BASE_URL="http://localhost:8080"

WORKDIR /app

COPY package.json yarn.lock /app/

RUN : \
    && yarn install \
    && :

COPY . /app

RUN : \
    && echo "SCRATCHLOG_BASE_URL=${SCRATCHLOG_BASE_URL}" > .env \
    && echo "LITTERBOX_BASE_URL=${LITTERBOX_BASE_URL}" >> .env \
    && yarn build \
    && :

################################################################################

FROM docker.io/library/nginx:stable

COPY --from=builder /app/build /usr/share/nginx/html
