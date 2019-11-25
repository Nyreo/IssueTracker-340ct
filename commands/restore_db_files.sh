#!/usr/bin/env bash

echo "Restoring original db files."

cd ../back-end/temp_db
mv *.db ../
cd ../
rm -r temp_db

echo -e "\tDb files successfully restored."