#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

mkdir -p "${SCRIPT_DIR}/.db" && \
  chmod o+w "${SCRIPT_DIR}/.db"

docker-compose up -d --build bot
