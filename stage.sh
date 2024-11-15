#!/bin/bash
cd /home/AgentC
git fetch origin
git checkout prod
git pull origin prod
docker-compose down
docker-compose up -d --build
echo "Stage environment updated and restarted."
