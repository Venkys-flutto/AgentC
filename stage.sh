# #!/bin/bash

# # Variables
# REPO_PATH="/home/AgentC"
# MAIN_BRANCH="main"
# STAGE_BRANCH="stage"
# LOG_FILE="/var/log/AgentC/stage.log"

# # Ensure log directory exists
# mkdir -p /var/log/AgentC

# # Function to log messages
# log() {
#   echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
# }

# log "=== Starting Stage Deployment ==="

# # Navigate to the repository
# cd $REPO_PATH || { log "ERROR: Repository path not found"; exit 1; }

# # Check for uncommitted changes and stash if needed
# if [[ $(git status --porcelain) ]]; then
#   log "Uncommitted changes detected. Stashing changes."
#   if ! git stash; then
#     log "ERROR: Failed to stash changes."
#     exit 1
#   fi
# fi

# # Fetch the latest changes
# if git fetch origin; then
#   log "Fetched origin successfully."
# else
#   log "ERROR: Failed to fetch origin."
#   exit 1
# fi

# # Ensure the main branch is up-to-date
# if git checkout $MAIN_BRANCH && git pull --no-rebase origin $MAIN_BRANCH; then
#   log "Checked out and updated $MAIN_BRANCH."
# else
#   log "ERROR: Failed to update $MAIN_BRANCH."
#   exit 1
# fi

# # Merge main into stage
# if git checkout $STAGE_BRANCH && git merge $MAIN_BRANCH -m "Auto-merged $MAIN_BRANCH into $STAGE_BRANCH"; then
#   log "Merged $MAIN_BRANCH into $STAGE_BRANCH."
# else
#   log "ERROR: Failed to merge $MAIN_BRANCH into $STAGE_BRANCH."
#   exit 1
# fi

# # Reapply any stashed changes
# if git stash pop; then
#   log "Re-applied stashed changes."
# else
#   log "ERROR: Failed to re-apply stashed changes."
#   exit 1
# fi

# # Restart the stage environment
# if docker-compose down && docker-compose up -d --build; then
#   log "Stage environment restarted successfully."
# else
#   log "ERROR: Failed to restart the stage environment."
#   exit 1
# fi

# log "=== Stage Deployment Completed ==="


#!/bin/bash

# Variables
REPO_PATH="/home/AgentC"
MAIN_BRANCH="main"
STAGE_BRANCH="stage"
LOG_FILE="/var/log/AgentC/stage.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Ensure the log directory exists
mkdir -p /var/log/AgentC

# Function to log messages with timestamps
log() {
  echo "$TIMESTAMP $1" >> "$LOG_FILE"
}

# Function to check the last command status and exit if failed
check_status() {
  if [ $? -ne 0 ]; then
    log "ERROR: $1"
    exit 1
  fi
}

log "=== Starting Stage Deployment ==="

# Ensure the script is run as the correct user
if [ "$(whoami)" != "agentc" ]; then
  log "ERROR: Script must be run as user 'agentc'."
  exit 1
fi

# Navigate to the repository
cd $REPO_PATH || { log "ERROR: Repository path $REPO_PATH not found"; exit 1; }
log "Navigated to repository path: $REPO_PATH"

# Check for uncommitted changes and stash if needed
if [[ $(git status --porcelain) ]]; then
  log "Uncommitted changes detected. Stashing changes."
  git stash --include-untracked
  check_status "Failed to stash changes."
  log "Stashed changes successfully."
fi

# Fetch the latest changes from the remote
git fetch origin
check_status "Failed to fetch origin."

# Ensure the main branch is up-to-date
git checkout $MAIN_BRANCH
check_status "Failed to checkout $MAIN_BRANCH."
git pull --no-rebase origin $MAIN_BRANCH
check_status "Failed to update $MAIN_BRANCH."
log "Checked out and updated $MAIN_BRANCH."

# Merge main into stage branch
git checkout $STAGE_BRANCH
check_status "Failed to checkout $STAGE_BRANCH."
git merge $MAIN_BRANCH -m "Auto-merged $MAIN_BRANCH into $STAGE_BRANCH"
check_status "Failed to merge $MAIN_BRANCH into $STAGE_BRANCH."
log "Merged $MAIN_BRANCH into $STAGE_BRANCH."

# Reapply any stashed changes
if git stash pop; then
  log "Re-applied stashed changes successfully."
else
  log "ERROR: Failed to re-apply stashed changes."
  exit 1
fi

# Restart the stage environment
docker-compose down
check_status "Failed to bring down the stage environment."
docker-compose up -d --build
check_status "Failed to restart the stage environment."

log "=== Stage Deployment Completed ==="

# Ensure script exits successfully if all steps complete
exit 0
