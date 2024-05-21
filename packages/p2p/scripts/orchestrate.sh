#!/usr/bin/env bash

REMOTE_IPS=$REACTOR_REMOTE_IPS
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

    local DOCKER_COMMAND="docker run -d --name p2p-node-$PORT \
      -e EXTERNAL_IP=$EXTERNAL_IP \
      -e PORT=$PORT \
      -e BRIDGE_PORT=$BRIDGE_PORT \
      -e BRIDGE_IS_LEADER=$BRIDGE_IS_LEADER \
      -e BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD \
      -e BRIDGE_BOOTSTRAP_NODE=$BRIDGE_BOOTSTRAP_NODE \
      -e TRY_COUNT=-1 \
      -p $PORT:$PORT \
      -p $BRIDGE_PORT:$BRIDGE_PORT \
      -v $DATA_DIR/$PORT:/dist/data \
      leverj/p2p:dev node app.js"

#    echo $DOCKER_COMMAND
     if [ -n "$REMOTE" ]; then
#       echo its remote
       ssh root@$EXTERNAL_IP "$DOCKER_COMMAND"
     else
#       echo its local
       $DOCKER_COMMAND
     fi
  done
}

function local_install() {
    echo "Local install"
    local_build
    local COUNT=$1
    local BRIDGE_THRESHOLD=$(($COUNT/2 + 1))
    local EXTERNAL_IP=$(ifconfig en0 inet | grep  inet |awk '{print $2}')
    local BRIDGE_BOOTSTRAP_NODE=http://$EXTERNAL_IP:9000
    rm -rf ../.node.ignore
    local total=$(($COUNT + 9000))
    docker ps -aq -f NAME=p2p-node | xargs docker stop | xargs docker rm
#    echo \
    EXTERNAL_IP=$EXTERNAL_IP BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD BRIDGE_BOOTSTRAP_NODE=$BRIDGE_BOOTSTRAP_NODE \
      DATA_DIR=${PWD}/../.node.ignore deployDocker 9000 $(($COUNT + 9000 - 1))
}

function remote_leader(){
  local FIRST_IP=$(echo $REMOTE_IPS | cut -d, -f1)
  echo http://$FIRST_IP:9000
}

function remote_install() {
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
      local END=$(($START + $EACH_COUNT - 1 ))
      ssh root@$EXTERNAL_IP "
        rm -rf /var/lib/reactor/data
        docker ps -aq -f NAME=p2p-node | xargs docker stop | xargs docker rm
        docker pull leverj/p2p:dev
      "
      [[ $? -ne 0 ]] && echo "no docker containers on $EXTERNAL_IP"
#      echo \
      REMOTE=true EXTERNAL_IP=$EXTERNAL_IP BRIDGE_THRESHOLD=$BRIDGE_THRESHOLD BRIDGE_BOOTSTRAP_NODE=$BRIDGE_BOOTSTRAP_NODE \
        DATA_DIR=/var/lib/reactor/data  deployDocker $START $END
      START=$(($END + 1))
    done
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
esac


function install_docker_ubuntu() {
  # Add Docker's official GPG key:
  sudo apt-get update
  sudo apt-get install ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc

  # Add the repository to Apt sources:
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
}
