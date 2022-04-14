# interview-training
Appworks school self-project


# Code Training
## Suppose
We suppose javescript, python, and go language.

## Init
You need to deploy a python image and a js image of docker to run coding trainging.

```
cd server/util/code-training
docker build -t python-image -f python-dockerfile .
docker build -t node-image -f node-dockerfile .
```

You don't need to build go language image, because it is compiling language which need its environment. 
So we use build-go.sh to run the go question.

```

```