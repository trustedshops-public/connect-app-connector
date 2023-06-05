#!/bin/bash
echo "Waiting up to 20 seconds for localhost to become available."
localhost_found=false
for i in {1..10}
do
    curl --silent http://localhost:3000/
    response=$?
    if [ "$response" = "0" ]; then
        echo "localhost is available"
        localhost_found=true
        break
    else
        sleep 2
    fi
done

if [ "$localhost_found" = false ]; then
    echo "Error! localhost did not become available in 20 seconds. Has the installer run successfully?"
    exit 1
fi