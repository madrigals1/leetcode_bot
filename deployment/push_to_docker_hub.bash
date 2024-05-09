#!/bin/bash

printf "\n>>> Go to appropriate folder\n\n"
cd ~/projects/leetcode_bot

printf "\n>>> Restart Docker container\n\n"
docker compose down && docker compose up --build -d

printf "\n>>> Login to Docker\n\n"
docker login

printf "\n>>> Tag image\n\n"
docker tag leetcode_bot madrigals1/leetcode_bot

printf "\n>>> Push image\n"
docker push madrigals1/leetcode_bot
