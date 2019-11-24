#!/usr/bin/env bash

echo "Deploying back end subtree to heroku..."
git subtree push --prefix back-end heroku-api master