FROM leverj/nodejs:v20.15.1
COPY dist ./dist
RUN  \
     apk add --no-cache --virtual .build-deps-full binutils-gold g++ gcc gnupg libgcc linux-headers make python3 ffmpeg && \
     cd dist && npm install leverj-reactor.mcl.tgz && \
     yarn install --production --pure-lockfile && \
     apk del .build-deps-full
WORKDIR /dist
