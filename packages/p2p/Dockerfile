FROM leverj/nodejs:v20.12.2
COPY dist ./dist
RUN \
      apk add --no-cache --virtual .build-deps-full binutils-gold g++ gcc gnupg libgcc linux-headers make python3 ffmpeg && \
      cd dist && yarn install --production --pure-lockfile && \
      apk del .build-deps-full
EXPOSE 9001
WORKDIR /dist
