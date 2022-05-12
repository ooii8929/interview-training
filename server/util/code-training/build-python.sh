#!/bin/sh

docker run --rm -v $(pwd)/server/util/code-training:/app -i python-image:latest  python3 $1