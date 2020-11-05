#!/bin/sh
docker run \
  -it \
  -p 3000:3000 \
  -v /home/dgrote/git/bachelor/api:/usr/src/app \
  -v /home/dgrote/bachelor-runtime:/var/run \
  -d \
  bachelor:dev
