#!/usr/bin/env bash
cd "$(dirname "$0")/.."
P2P_DIR="$(pwd)"
echo "P2P_DIR: $P2P_DIR"
rm -rf dist
mkdir -p dist
cp -r src config package.json app.js dist/
cd ../mcl; npm pack; mv leverj-reactor.mcl*.tgz $P2P_DIR/dist/leverj-reactor.mcl.tgz
cd ../chain; npm pack; mv leverj-reactor.chain*.tgz $P2P_DIR/dist/leverj-reactor.chain.tgz
cd $P2P_DIR
docker build -t leverj/p2p:$(git branch | grep \* | cut -d ' ' -f2) .
