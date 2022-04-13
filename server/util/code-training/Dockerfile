# syntax = docker/dockerfile:experimental


FROM golang:1.16 AS builder
WORKDIR /go/src/github.com/alexellis/href-counter/
RUN GO111MODULE=off go get -d -v golang.org/x/net/html
COPY app.go    ./
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build GO111MODULE=auto CGO_ENABLED=0 GOOS=linux go build -o app .

FROM alpine:latest
RUN apk add ca-certificates
WORKDIR /root/
COPY --from=builder /go/src/github.com/alexellis/href-counter/app ./
CMD ["./app"]