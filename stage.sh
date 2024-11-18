#!/bin/bash

# Variables
REPO_PATH="/home/AgentC"
MAIN_BRANCH="main"
STAGE_BRANCH="stage"
LOG_FILE="/var/log/AgentC/stage.log"

# Ensure log directory exists
mkdir -p /var/log/AgentC

# Function to log messages
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

log "=== Starting Stage Deployment ==="

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

# Ensure main is up-to-date
if git checkout $MAIN_BRANCH && git pull origin $MAIN_BRANCH; then
  log "Checked out and updated $MAIN_BRANCH."
else
  log "ERROR: Failed to update $MAIN_BRANCH."
  exit 1
fi

# Switch to the stage branch and reset it to match the main branch
if git checkout $STAGE_BRANCH && git reset --hard origin/$MAIN_BRANCH; then
  log "Pulled latest changes from $MAIN_BRANCH into $STAGE_BRANCH."
else
  log "ERROR: Failed to update $STAGE_BRANCH."
  exit 1
fi

# Restart the stage environment
if docker-compose down && docker-compose up -d --build; then
  log "Stage environment restarted successfully."
else
  log "ERROR: Failed to restart the stage environment."
  exit 1
fi

# Apply the stashed changes (if any)
git stash pop
log "Applied stashed changes."

log "=== Stage Deployment Completed ==="
