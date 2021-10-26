# syntax=docker/dockerfile:1.2
FROM nodejs:14

WORKDIR /usr/src/transformer

ENV INPUT=
ENV OUTPUT=

# improve docker caching by adding these two separately
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=NPM_TOKEN \
	echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/NPM_TOKEN)" > ~/.npmrc && \
	npm ci && \
	rm -f ~/.npmrc

COPY . ./
RUN npm run build

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
