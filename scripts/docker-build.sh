#!/usr/bin/env bash
cd "$(dirname "$0")/.."

P2P_DIR="$(pwd)"
echo "P2P_DIR: $P2P_DIR"
#rm -rf dist
#mkdir -p dist
#cp -r src package.json app.js config.js dist/
#cd ../config; npm pack; mv leverj-reactor.config*.tgz $P2P_DIR/dist/leverj-reactor.config.tgz
#cd ../common; npm pack; mv leverj-reactor.common*.tgz $P2P_DIR/dist/leverj-reactor.common.tgz
#cd ../chain-deployment; npm pack; mv leverj-reactor.chain-deployment*.tgz $P2P_DIR/dist/leverj-reactor.chain-deployment.tgz
#cd ../chain-tracking; npm pack; mv leverj-reactor.chain-tracking*.tgz $P2P_DIR/dist/leverj-reactor.chain-tracking.tgz
#cd ../mcl; npm pack; mv leverj-reactor.mcl*.tgz $P2P_DIR/dist/leverj-reactor.mcl.tgz
#cd ../chain; npm pack; mv leverj-reactor.chain*.tgz $P2P_DIR/dist/leverj-reactor.chain.tgz
cd $P2P_DIR
docker build -t leverj/p2p:$(git branch | grep \* | cut -d ' ' -f2) .

