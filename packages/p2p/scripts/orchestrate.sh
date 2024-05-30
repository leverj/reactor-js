#!/usr/bin/env bash

REMOTE_IPS=$REACTOR_REMOTE_IPS
BRANCH=$(git branch | grep \* | cut -d ' ' -f2)
BRIDGE_BOOTSTRAP_NODES='[]'

function local_build() {
    cd ..
    yarn docker:build
    cd scripts
}

function deployDocker() {
  local START=$1
  local END=$2
  for i in $(eval echo {$START..$END}); do
    local PORT=$i
    local BRIDGE_PORT=$(($i+1000))
    if [ $i -eq 9000 ]; then
      local BRIDGE_IS_LEADER=true
    else
      local BRIDGE_IS_LEADER=false
    fi
    echo "Starting node... $PORT $BRIDGE_PORT"

    local DOCKER_COMMAND="docker run -d --name p2p-node-$PORT  \
      -e EXTERNAL_IP=$EXTERNAL_IP \
      -e PORT=$PORT \
      -e BRIDGE_PORT=$BRIDGE_PORT \
      -e BRIDGE_IS_LEADER=$BRIDGE_IS_LEADER \
      -e BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD \
      -e BRIDGE_BOOTSTRAP_NODES=$BRIDGE_BOOTSTRAP_NODES \
      -e TRY_COUNT=-1 \
      -e BRIDGE_IS_PUBLIC=$BRIDGE_IS_PUBLIC \
      -p $PORT:$PORT \
      -p $BRIDGE_PORT:$BRIDGE_PORT \
      -v $DATA_DIR/$PORT:/dist/data \
      leverj/p2p:$BRANCH node app.js"

#    echo $DOCKER_COMMAND
     if [ -n "$REMOTE" ]; then
       echo its remote. $DOCKER_COMMAND
       ssh root@$EXTERNAL_IP "$DOCKER_COMMAND"
     else
       echo its local. $DOCKER_COMMAND
       $DOCKER_COMMAND
     fi
     if [ "$i" -eq "9000" ]; then
       sleep 10
       local LEADER_ADDR=$(curl -s http://$EXTERNAL_IP:9000/api/fixme/bridge/multiaddr | jq -r .multiaddr)
       if [ -n "$REMOTE" ]; then
         echo remote
         BRIDGE_BOOTSTRAP_NODES=[\\\"$LEADER_ADDR\\\"]
       else
         echo local
         BRIDGE_BOOTSTRAP_NODES=[\"$LEADER_ADDR\"]
       fi
     fi
  done
}

function local_install() {
    local_build
    local COUNT=$1
    local BRIDGE_THRESHOLD=$(($COUNT/2 + 1))
    local EXTERNAL_IP=$(ifconfig en0 inet | grep  inet |awk '{print $2}')
    local BRIDGE_BOOTSTRAP_NODE=http://$EXTERNAL_IP:9000
    rm -rf ../.node.ignore
    local total=$(($COUNT + 9000))
    docker ps -aq -f NAME=p2p-node | xargs docker stop | xargs docker rm
#    echo \
    EXTERNAL_IP=$EXTERNAL_IP BRIDGE_IS_PUBLIC=true BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD BRIDGE_BOOTSTRAP_NODE=$BRIDGE_BOOTSTRAP_NODE \
      DATA_DIR=${PWD}/../.node.ignore deployDocker 9000 $(($COUNT + 9000 - 1))

    sleep 10
    local_whitelist
    sleep 10
    local_dkg
    sleep 10
    local_sign
}

function remote_leader(){
  local FIRST_IP=$(echo $REMOTE_IPS | cut -d, -f1)
  echo http://$FIRST_IP:9000
}

function copy_docker_image() {
  local EXTERNAL_IP=$1
  docker save -o image.gzip leverj/p2p:$BRANCH
  scp image.gzip root@$EXTERNAL_IP:/tmp
  rm image.gzip
  ssh root@$EXTERNAL_IP "gzip -c /tmp/image.gzip | docker load"
}

function remote_install() {
    if [ "$IMAGE" = "NEW" ]; then local_build; fi
    local COUNT=$1
    local IP_COUNT=$(echo $REMOTE_IPS | tr ',' '\n' | wc -l)
    local EACH_COUNT=$(($COUNT/$IP_COUNT))
    COUNT=$(($EACH_COUNT*$IP_COUNT))
    local BRIDGE_THRESHOLD=$(($COUNT/2 + 1))
    local FIRST_IP=$(echo $REMOTE_IPS | cut -d, -f1)
    local BRIDGE_BOOTSTRAP_NODE=$(remote_leader)
    local START=9000
    for IP in $(echo $REMOTE_IPS | tr ',' '\n'); do
      local EXTERNAL_IP=$IP
      if [ "$IMAGE" = "NEW" ]; then copy_docker_image $EXTERNAL_IP; fi
      local END=$(($START + $EACH_COUNT - 1 ))
      ssh root@$EXTERNAL_IP "
        rm -rf /var/lib/reactor/data
        docker ps -aq -f NAME=p2p-node | xargs docker stop | xargs docker rm
        if [ -z "$IMAGE" ]; then docker pull leverj/p2p:$BRANCH; fi
      "
      [[ $? -ne 0 ]] && echo "no docker containers on $EXTERNAL_IP"
#      echo \
      REMOTE=true EXTERNAL_IP=$EXTERNAL_IP BRIDGE_IS_PUBLIC=true BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD BRIDGE_BOOTSTRAP_NODE=$BRIDGE_BOOTSTRAP_NODE \
        DATA_DIR=/var/lib/reactor/data  deployDocker $START $END
      START=$(($END + 1))
    done

    sleep 10
    remote_whitelist
    sleep 10
    remote_dkg
    sleep 10
    remote_sign
}

function local_whitelist() {
    echo "Local whitelist"
    curl --location --request POST 'http://localhost:9000/api/publish/whitelist'
}
function remote_whitelist() {
    echo "Remote whitelist"
    curl --location --request POST $(remote_leader)/api/publish/whitelist
}
function local_dkg() {
    echo "Local DKG"
    curl --location --request POST 'http://localhost:9000/api/dkg/start'
}
function remote_dkg() {
    echo "Remote DKG"
    curl --location --request POST $(remote_leader)/api/dkg/start
}

function local_sign() {
    echo "Local sign"
    curl --location --request POST 'http://localhost:9000/api/tss/aggregateSign' \
    --header 'Content-Type: application/json' \
    --data '{
        "txnHash": "hash123456",
        "msg": "hello world"
    }'
    sleep 5
    curl http://localhost:9000/api/tss/aggregateSign?txnHash=hash123456
}
function remote_sign() {
    echo "Remote sign"
    curl --location --request POST $(remote_leader)/api/tss/aggregateSign \
    --header 'Content-Type: application/json' \
    --data '{
        "txnHash": "hash123456",
        "msg": "hello world"
    }'
    echo
    sleep 5
    curl $(remote_leader)/api/tss/aggregateSign?txnHash=hash123456
    echo
}

function local_info() {
    echo "Local info"
    curl --location --request GET 'http://localhost:9000/api/info'
}

function remote_info() {
    echo "Remote info"
    curl --location --request GET $(remote_leader)/api/info
}

OPERATION=$1
shift
case "${OPERATION}" in
local) local_install $@ ;;
remote) remote_install $@ ;;
local_whitelist) local_whitelist $@ ;;
remote_whitelist) remote_whitelist $@ ;;
local_dkg) local_dkg $@ ;;
remote_dkg) remote_dkg $@ ;;
local_sign) local_sign $@ ;;
remote_sign) remote_sign $@ ;;
local_info) local_info $@ ;;
remote_info) remote_info $@ ;;
local_docker_stop) docker ps -aq -f NAME=p2p-node | xargs docker stop | xargs docker rm ;;
remote_docker_stop) ssh root@$EXTERNAL_IP "docker ps -aq -f NAME=p2p-node | xargs docker stop | xargs docker rm" ;;
esac

# IMAGE=NEW                  create local image and copy to remote
# IMAGE=anything             use existing image
# IMAGE=       pull image from docker hub

