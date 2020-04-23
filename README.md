# Getting Started

## Prerequisities

- Make sure you are on the *filters* branch ```git checkout -b filters origin/filters```
- Node v6.10.0 ```nvm install 6.10.0 && nvm use 6.10.0```
- NPM v3.10.10
- Docker ```https://store.docker.com/editions/community/docker-ce-desktop-mac``` (Open Docker.app to finalize installation)

## Deploying

```
git clone https://gitlab.com/neap/image-proxy.git && cd image-proxy
git checkout -b filters origin/filters
git pull
nvm use 6.10.0
npm install
npm run build
```

- Upload ```image-proxy.zip``` to AWS using the online console