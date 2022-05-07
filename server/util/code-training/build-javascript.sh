#!/bin/sh

docker run --cpus=".5" --rm -v $(pwd)/server/util/code-training:/app -i node-image:latest