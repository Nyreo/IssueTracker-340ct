#!/usr/bin/env bash

function cleanUp() 
{
	echo -e "Performing cleanup...\n\tRemoving new db files"
	cd ../back-end
	rm -r *.db
	../commands/restore_db_files.sh

	# kill jobs
	echo -e "\tKilling created jobs"
	kill $(jobs -p)
	# jobs
}

trap cleanUp EXIT 

set -e
mkdir -p screenshots
mkdir -p trace
# move current db files out of access
../commands/temp_db_files.sh
# run server
cd ../back-end
node index.js &

# serve front end build
cd ../front-end/build_scripts/
node index.js &

cd ../
# npx serve -s build &
# [ ! -d "node_modules" ] && echo "INSTALLING MODULES" && npm install
node_modules/.bin/jest --runInBand --detectOpenHandles acceptance_tests

