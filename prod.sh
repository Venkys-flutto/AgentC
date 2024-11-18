#!/bin/bash

# Variables
REPO_PATH="/home/AgentC"
STAGE_BRANCH="stage"
PROD_BRANCH="prod"
LOG_FILE="/var/log/AgentC/prod.log"

# Ensure log directory exists
mkdir -p /var/log/AgentC

# Function to log messages
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

log "=== Starting Production Deployment ==="

# Navigate to the repository
cd $REPO_PATH || { log "ERROR: Repository path not found"; exit 1; }

# Stash any local changes
git stash --include-untracked
log "Stashed local changes."

# Fetch the latest changes
if git fetch origin; then
  log "Fetched origin successfully."
else
  log "ERROR: Failed to fetch origin."
  exit 1
fi

# Ensure stage is up-to-date
if git checkout $STAGE_BRANCH && git pull origin $STAGE_BRANCH; then
  log "Checked out and updated $STAGE_BRANCH."
else
  log "ERROR: Failed to update $STAGE_BRANCH."
  exit 1
fi

# Switch to the prod branch and pull changes from stage
if git checkout $PROD_BRANCH && git pull origin $STAGE_BRANCH; then
  log "Pulled changes from $STAGE_BRANCH into $PROD_BRANCH."
else
  log "ERROR: Failed to pull changes from $STAGE_BRANCH into $PROD_BRANCH."
  exit 1
fi

# Restart the production environment
if docker-compose down && docker-compose up -d --build; then
  log "Production environment restarted successfully."
else
  log "ERROR: Failed to restart the production environment."
  exit 1
fi

# Apply the stashed changes (if any)
git stash pop
log "Applied stashed changes."

log "=== Production Deployment Completed ==="

