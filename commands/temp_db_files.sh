#!/usr/bin/env bash

echo "Moving *.db files out of access."

cd ../back-end
mkdir temp_db
mv *.db temp_db

echo -e "\tdb files successfully moved out of access."