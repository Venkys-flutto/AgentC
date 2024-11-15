#!/bin/bash
cd /home/AgentC
git fetch origin
git checkout prod
git pull origin prod
docker-compose down
docker-compose build --no-cache
echo "Production environment updated and restarted. "
