#!/bin/bash

set -e

echo "installing test prerequisites"
pip3 install --upgrade -r src/tests/resources/requirements.txt

if [ ! -f src/tests/resources/scripts/local-env.sh ]
then
   cp src/tests/resources/scripts/local-env.sh.template src/tests/resources/scripts/local-env.sh
fi

echo "installing ChromeDriver"
OS=$(uname)
case $OS in
  'Darwin')
    CHROME_DRIVER_PATH="/usr/local/bin"
    ;;
  *)
    CHROME_DRIVER_PATH="$HOME/.local/bin"
    ;;
esac

webdrivermanager chrome --linkpath $CHROME_DRIVER_PATH

echo "done!"