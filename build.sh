yarn install
npm run build
docker build -t $(cat package.json | jq -r '(.name + ":" + .version)') .