#!/bin/bash
cd 'dirname $0'
pwd
cd Nodejs/Linux
./node ../../src/Core.js
read -n1 -r -p "Press any key to close" key