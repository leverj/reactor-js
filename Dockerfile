FROM leverj/nodejs:v20.15.1
COPY ../../.. ./dist
RUN  \
     apk add --no-cache --virtual .build-deps-full binutils-gold g++ gcc gnupg libgcc linux-headers make python3 ffmpeg && \
     cd dist && \
     find . -name node_modules | xargs rm -rf && \
     rm -rf data .circleci .idea .vscode .ignore Dockerfile scripts packages/chain/artifacts packages/chain/cache && \
     yarn && \
     apk del .build-deps-full
WORKDIR /dist/packages/p2p