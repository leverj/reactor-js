#!/usr/bin/env bash

cd ../packages/p2p
yarn docker:build
cd ../../scripts
EXTERNAL_IP=192.168.1.69
BRIDGE_IS_LEADER=true
BRIDGE_THRESHOLD=4
BRIDGE_BOOTSTRAP_NODE=http://$EXTERNAL_IP:9000
TRY_COUNT=-1
function startNode() {
  echo "Starting node..."
  docker stop p2p-node-$PORT
  docker rm p2p-node-$PORT
#  docker pull leverj/p2p:dev
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


PORT=9000 BRIDGE_PORT=10000 BRIDGE_IS_LEADER=true startNode
PORT=9001 BRIDGE_PORT=10001 BRIDGE_IS_LEADER=false startNode
PORT=9002 BRIDGE_PORT=10002 BRIDGE_IS_LEADER=false startNode
PORT=9003 BRIDGE_PORT=10003 BRIDGE_IS_LEADER=false startNode
PORT=9004 BRIDGE_PORT=10004 BRIDGE_IS_LEADER=false startNode
PORT=9005 BRIDGE_PORT=10005 BRIDGE_IS_LEADER=false startNode
PORT=9006 BRIDGE_PORT=10006 BRIDGE_IS_LEADER=false startNode
PORT=9007 BRIDGE_PORT=10007 BRIDGE_IS_LEADER=false startNode

#curl --location --request POST 'http://localhost:9000/api/publish/whitelist'
#curl --location --request POST 'http://localhost:9000/api/dkg/start'