# Transformer template

Takes in a `service-source` and creates a Docker image as artifact for the contract specified in `.data.fragment`.

Listing multiple platforms under `.data.$transformer.platforms` allows building one image per architecture.

# Multi-Arch

> This is WIP and needs improving

We need to create multiple instances of this transformer with different parameters, 
because we want to trigger on the same input once per platform specified and not just once per input.

Currently those values are hard-coded in the `balena.yml` and need to be changed when building for non-amd64 architectures.
You basically need to change all lines that contain `amd64` except for the list of all supported platforms.

## Bootstrapping this Transformer

As this Transformer builds other Transformers and it needs secrets while doing so, getting it into the system the first time is a little tricky.
Here's how to do it:

1. execute `npm install` locally to get all dependencies with your npm token
2. remove/comment-out these lines in the `Dockerfile`
	```bash
	RUN --mount=type=secret,id=NPM_TOKEN \
		echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/NPM_TOKEN)" > ~/.npmrc && \
		npm ci && \
		rm -f ~/.npmrc
	```
3. Ensure the version specified in `balena.yml` matches what you expect. (If you have a fresh system, there's no need to change it)
4. Ensure `.data.$transformer.encryptedSecrets.buildSecrets.NPM_TOKEN` is encrypted for your environment (the checked in value is encrypted for PROD). See the [PKI Readme](https://github.com/product-os/transformer-worker/tree/master/pki) in the Transformer Worker. In its `docker-compose.yml` you'll find the private key for local testing.
5. Build and upload the Transformer with the [Reflect CLI](https://github.com/balena-io-playground/reflect-cli/):
	```bash
	npm start create-transformer ../../source-to-image
	```
