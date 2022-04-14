#!/bin/sh

docker run --rm -v "$(pwd)":/app -it node-image:latest
