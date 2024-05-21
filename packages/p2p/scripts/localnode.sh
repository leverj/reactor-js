#!/usr/bin/env bash

cd ..
yarn docker:build
cd scripts
EXTERNAL_IP=$(ifconfig en0 inet | grep  inet |awk '{print $2}')
BRIDGE_IS_LEADER=true
BRIDGE_THRESHOLD=4
BRIDGE_BOOTSTRAP_NODE=http://$EXTERNAL_IP:9000
TRY_COUNT=-1
function startNode() {
  echo "Starting node... $PORT $BRIDGE_PORT"
  docker stop p2p-node-$PORT
  docker rm p2p-node-$PORT
  docker run -d --name p2p-node-$PORT \
    -e EXTERNAL_IP=$EXTERNAL_IP \
    -e PORT=$PORT \
    -e BRIDGE_PORT=$BRIDGE_PORT \
    -e BRIDGE_IS_LEADER=$BRIDGE_IS_LEADER \
    -e BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD \
    -e BRIDGE_BOOTSTRAP_NODE=$BRIDGE_BOOTSTRAP_NODE \
    -e TRY_COUNT=$TRY_COUNT \
    -p $PORT:$PORT \
    -p $BRIDGE_PORT:$BRIDGE_PORT \
    -v ${PWD}/../.node.ignore/$PORT:/dist/data \
    leverj/p2p:dev node app.js
}

rm -rf ../.node.ignore
PORT=9000 BRIDGE_PORT=10000 BRIDGE_IS_LEADER=true startNode
for i in {9001..9050}; do
  PORT=$i BRIDGE_PORT=$(($i+1000)) BRIDGE_IS_LEADER=false startNode
done
#sleep 10
#curl --location --request POST 'http://localhost:9000/api/publish/whitelist'
#sleep 20
#curl --location --request POST 'http://localhost:9000/api/dkg/start'