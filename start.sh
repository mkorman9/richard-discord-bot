#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

mkdir -p "${SCRIPT_DIR}/.db" && \
  chmod u+rwx "${SCRIPT_DIR}/.db"

export DOCKER_UID=$(id -u)
export DOCKER_GID=$(id -g)

docker-compose up -d --build bot
