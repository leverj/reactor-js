#!/usr/bin/bash

ETH_DIR=/root/ethereum
CONSENSUS=$ETH_DIR/node/consensus
EXECUTION=$ETH_DIR/node/execution

function init(){
    rm -rf $ETH_DIR/node
    rm -rf $ETH_DIR/prysm
    mkdir -p $CONSENSUS
    mkdir -p $EXECUTION
}

function get_geth(){
    cd $ETH_DIR
    wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.14.7-aa55f5ea.tar.gz
    gunzip geth-linux-amd64-1.14.7-aa55f5ea.tar.gz
    tar -xvf geth-linux-amd64-1.14.7-aa55f5ea.tar
    mv geth-linux-amd64-1.14.7-aa55f5ea/geth $EXECUTION/
    rm -rf geth-linux*
}

function create_prysm(){
    cd $ETH_DIR
    git clone --branch v5.0.3 https://github.com/prysmaticlabs/prysm.git
    cd prysm
    CGO_CFLAGS="-O2 -D__BLST_PORTABLE__" go build -o=$CONSENSUS/beacon-chain ./cmd/beacon-chain
    CGO_CFLAGS="-O2 -D__BLST_PORTABLE__" go build -o=$CONSENSUS/validator ./cmd/validator
    CGO_CFLAGS="-O2 -D__BLST_PORTABLE__" go build -o=$CONSENSUS/prysmctl ./cmd/prysmctl
}

function beacon_genesis(){
    cd $CONSENSUS
    cp $ETH_DIR/config.yml .
    cp $ETH_DIR/genesis.json .
    ./prysmctl testnet generate-genesis --fork capella --num-validators 64 --genesis-time-delay 240 --chain-config-file $CONSENSUS/config.yml --geth-genesis-json-in $CONSENSUS/genesis.json --geth-genesis-json-out $EXECUTION/genesis.json --output-ssz $CONSENSUS/genesis.ssz
}

function account_import(){
    cd $EXECUTION
    rm -rf .gethdata/keystore
    ./geth --datadir=$EXECUTION/.gethdata account import $ETH_DIR/secret.txt
}

function geth_genesis(){
    cd $EXECUTION
    rm -rf .gethdata/geth
    ./geth --datadir=$EXECUTION/.gethdata init $EXECUTION/genesis.json 
}

function geth_start(){
    cd $EXECUTION
    nohup ./geth --http --http.addr 0.0.0.0 --http.corsdomain=* --authrpc.vhosts=* --authrpc.addr 0.0.0.0 --http.api eth,net,web3 --ws --ws.api eth,net,web3 --authrpc.jwtsecret $ETH_DIR/jwt.hex --datadir $EXECUTION/.gethdata --nodiscover --syncmode full --allow-insecure-unlock --unlock "0x123463a4b065722e99115d6c222f267d9cabb524" --password $ETH_DIR/geth_password.txt --verbosity 4 --authrpc.port 8551 &> $ETH_DIR/node/execution.log &
}

function beacon_start(){
    cd $CONSENSUS
    nohup ./beacon-chain --datadir $CONSENSUS/.beacondata \
        --min-sync-peers 0 \
        --genesis-state $CONSENSUS/genesis.ssz \
        --interop-eth1data-votes \
        --chain-config-file $CONSENSUS/config.yml \
        --contract-deployment-block 0 \
        --chain-id 32382 \
        --network-id 32382 \
        --rpc-host 0.0.0.0 \
        --grpc-gateway-host 0.0.0.0 \
        --execution-endpoint $EXECUTION/.gethdata/geth.ipc \
        --accept-terms-of-use \
        --jwt-secret $ETH_DIR/jwt.hex \
        --suggested-fee-recipient 0x123463a4b065722e99115d6c222f267d9cabb524 \
        --minimum-peers-per-subnet 0 \
        --enable-debug-rpc-endpoints &> $ETH_DIR/node/beacon.log &
}
function validator_start(){
    cd $CONSENSUS
    nohup ./validator --datadir $CONSENSUS/.validatordata --accept-terms-of-use --interop-num-validators 64 --chain-config-file $CONSENSUS/config.yml --beacon-rpc-provider=localhost:4000 &> $ETH_DIR/node/validator.log &
}

function install_it(){
    init
    get_geth
    create_prysm
    beacon_genesis
    geth_genesis
}

function run_it(){
    geth_start
    beacon_start
    validator_start
}

function usage(){
    echo './l2.sh install|import|run'
}

OPERATION=$1
shift
case "${OPERATION}" in
install) install_it ;;
import) account_import ;;
run) run_it;;
*) usage ;;
esac
