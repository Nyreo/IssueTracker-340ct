#!/usr/bin/env bash

set -e
mkdir -p screenshots
mkdir -p trace
# rm -rf *.db
cd ../back-end
node index.js &
cd ../front-end
# react-scripts start&
# [ ! -d "node_modules" ] && echo "INSTALLING MODULES" && npm install
node_modules/.bin/jest --runInBand --detectOpenHandles acceptance_tests
read -p "Press enter to continue"
jobs
kill %1
