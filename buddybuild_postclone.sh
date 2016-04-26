#!/usr/bin/env bash

cd /Users/buddybuild/workspace
echo '=== Start to run : npm install npm -g'
npm install npm -g

if hash cordova 2>/dev/null; then
  echo '=== Detected cordova command, run npm update -g cordova'
    npm update -g cordova
else
  echo '=== Can not Detecte cordova command, run npm install -g cordova'
    npm install -g cordova
fi

if hash ionic 2>/dev/null; then
  echo '=== Detected ionic command, run npm update -g ionic'
    npm update -g ionic
else
  echo '=== Can not Detected ionic command, run npm install -g ionic'
    npm install -g ionic
fi

echo '=== Start to run : npm install'
npm install

echo '=== Start to run : bower install'
bower install

echo '=== Start to run : ionic info'
ionic info
#ionic platform add ios android

echo '=== Start to run : ionic state restore'
ionic state restore
ionic platform list

echo '=== Start to run : cp buddybuild_prebuild to ios platform'
cp ./buddybuild_prebuild.sh ./platforms/ios
echo '=== Start to run : cp buddybuild_prebuild to android platform'
cp ./buddybuild_prebuild.sh ./platforms/android
echo '=== Start to run : cp ./build_extra.gradle to android platform'
cp ./build-extras.gradle ./platforms/android

echo '=== Start to run : env'
env

if hash android 2>/dev/null; then
  echo '=== Detected android command, run android list sdk --all'
    android list sdk --all
fi