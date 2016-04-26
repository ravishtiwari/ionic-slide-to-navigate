#!/usr/bin/env bash

cd /Users/buddybuild/workspace

if [ -z ${PLATFORM+x} ]; then
  echo '=== Detected Environmental Variable PLATFORM is set : $PLATFORM'
  ionic build $PLATFORM
else
  echo '=== Can Not Detected Environmental Variable PLATFORM. ionic prepare both ios and android. PLATFORM: $PLATFORM'
  ionic build android ios
fi