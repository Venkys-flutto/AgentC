#!/bin/bash
cd /home/AgentC
git fetch origin
git checkout staging
git pull origin staging
docker-compose down
docker-compose up -d --build
echo "Staging environment updated and restarted."
