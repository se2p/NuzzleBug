# !/bin/bash

echo "Install Dependencies"
npm install

echo "Remove test files of whisker-main due to compiling issues"
rm -rf node_modules/whisker-main/test

echo "Start "
npm start
