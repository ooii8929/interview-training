docker build -t alexellis2/href-counter:latest . 2> /dev/null

docker run --rm --name test -t alexellis2/href-counter

docker rmi $(docker images -f "dangling=true" -q) 2>&1> /dev/null

