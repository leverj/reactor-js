#!/usr/bin/env bash

echo "Starting node..."

EXTERNAL_IP=
PORT=
IP=
BRIDGE_CONF_DIR=
BRIDGE_PORT=
BRIDGE_IS_LEADER=true
BRIDGE_THRESHOLD=4
BRIDGE_BOOTSTRAP_NODE=


docker stop p2p-node
docker rm p2p-node
docker pull leverj/p2p:main
docker run -it --name p2p-node \
  -e EXTERNAL_IP=$EXTERNAL_IP \
  -e PORT=$PORT \
  -e IP=$IP \
  -e BRIDGE_CONF_DIR=$BRIDGE_CONF_DIR \
  -e BRIDGE_PORT=$BRIDGE_PORT \
  -e BRIDGE_IS_LEADER=$BRIDGE_IS_LEADER \
  -e BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD \
  -e BRIDGE_BOOTSTRAP_NODE=$BRIDGE_BOOTSTRAP_NODE \
  -p 9001:9001 \
  -v ${PWD}/../.node:/root/data \
  leverj/p2p:main node app.js