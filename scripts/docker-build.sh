#!/usr/bin/env bash
cd "$(dirname "$0")/.."
docker build -t leverj/p2p:$(git branch | grep \* | cut -d ' ' -f2) .

