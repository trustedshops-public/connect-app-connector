#!/bin/bash
set -e

if [ ! -f ./src/tests/resources/scripts/local-env.sh ]
then
   echo "ERROR: local-env.sh not found"
   echo "       you have to run ./install.sh first!"
   exit 1
fi

source ./src/tests/resources/scripts/local-env.sh
./src/tests/resources/scripts/run.sh $@