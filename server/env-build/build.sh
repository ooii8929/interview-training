#!/bin/sh

docker build --no-cache -t golang/base:0.1.0 . -f ./server/env-build/Dockerfile.multi &>/dev/null

docker run --rm --name test -t golang/base:0.1.0

docker rmi $(docker images -f "dangling=true" -q) 2>&1> /dev/null
