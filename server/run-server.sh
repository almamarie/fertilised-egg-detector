#!/bin/bash
# Script to start server and dev processes, then open the overview page in the browser.

# Step 1: Go to Downloads/src/server and run 'npm run start'
cd ~/Documents/src/server || { echo "Failed to change directory to ~/Documents/src/server"; exit 1; }
npm run start &

# Step 2: Go to Documents/src/fertilised-egg-detector and run 'npm run dev'
cd ~/Documents/src/fertilised-egg-detector || { echo "Failed to change directory to ~/Documents/src/fertilised-egg-detector"; exit 1; }
npm run dev &

# Step 3: Wait for a few seconds and then open the browser at http://localhost:3000/overview
sleep 5
xdg-open "http://localhost:5173/overview"
