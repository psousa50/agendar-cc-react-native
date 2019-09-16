#!/bin/bash

rm -rf node_modules
yarn install
rm -rf /tmp/haste-map-react-native-packager-*
npm start -- --reset-cache
