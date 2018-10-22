#!/bin/bash -e

log() {
  echo -e "${NAMI_DEBUG:+${CYAN}${MODULE} ${MAGENTA}$(date "+%T.%2N ")}${RESET}${@}" >&2
}

install_packages() {
  log "Install packages"
  composer install
  npm install
  npm run build:prod
}

setup_db() {
  log "Configuring the database"
  php ./iris migrations:migrate
}

/root/wait-for-it.sh db:5432 -- echo "PostgreSQL started"
/root/wait-for-it.sh redis:6379 -- echo "Redis started"

install_packages
setup_db

supervisord -n
