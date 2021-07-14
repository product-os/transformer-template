#!/bin/sh

operation=${1:-index}

echo "input contents at $INPUT:"
find "$(dirname $INPUT)" -maxdepth 2
echo "output contents at $OUTPUT:"
find "$(dirname $OUTPUT)" -maxdepth 2

export DOCKER_BUILDKIT=1

dockerd >/dev/null 2>&1 &
# wait for docker startup
while ! docker info >/dev/null 2>&1; do sleep 1s; done

node ./build/${operation}.js
