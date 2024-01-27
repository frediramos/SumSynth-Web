#!/bin/bash

cd server
nodemon index.js &
cd ../sumsynth-client
npm start
