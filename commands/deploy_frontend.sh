#!/usr/bin/env bash

echo "Deploying front end subtree to heroku..."
git subtree push --prefix front-end heroku master