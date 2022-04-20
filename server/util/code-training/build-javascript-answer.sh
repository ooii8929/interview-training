#!/bin/sh

docker run --rm -v $(pwd)/server/util/code-training:/app -i node-image:latest node answer.js