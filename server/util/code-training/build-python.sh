#!/bin/sh

docker run  --cpus=".1" --memory="20m" --rm -v $(pwd)/server/util/code-training:/app --ulimit cpu=1 -i python-image:latest  python3 $1