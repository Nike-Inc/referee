#!/usr/bin/env bash

set +x

yarn server-start& >> server_dev.log 2>&1
SERVER_PID=$!

yarn client-start& >> client_dev.log 2>&1
CLIENT_PID=$!

trap ctrl_c INT

function ctrl_c() {
    kill -2 ${SERVER_PID}
    kill -2 ${CLIENT_PID}
}

tail -f *_dev.log