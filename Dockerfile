# syntax=docker/dockerfile:1.2
FROM docker:dind

WORKDIR /usr/src/transformer
ENTRYPOINT [ "./scripts/entrypoint.sh" ]

ENV REGISTRY_URL=
ENV TRANSFORMER_ACTOR=
ENV TRANSFORMER_SESSION=
ENV IN_CONTRACT=
ENV IN_ARTIFACT=
ENV OUT_DIR=

RUN apk add --no-cache docker-cli nodejs npm

# improve docker caching by adding these two separately
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=NPM_TOKEN \
	echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/NPM_TOKEN)" > ~/.npmrc && \
	npm ci && \
	rm -f ~/.npmrc

COPY . ./
RUN npm run build
