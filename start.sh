#!/bin/bash

# Parse Railway's DATABASE_URL into Spring Boot datasource env vars
# DATABASE_URL format: postgresql://user:password@host:port/database
if [ -n "$DATABASE_URL" ]; then
    DB_STRIPPED="${DATABASE_URL#postgresql://}"
    DB_USERPASS="${DB_STRIPPED%%@*}"
    DB_HOSTDB="${DB_STRIPPED#*@}"
    export SPRING_DATASOURCE_USERNAME="${DB_USERPASS%%:*}"
    export SPRING_DATASOURCE_PASSWORD="${DB_USERPASS#*:}"
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOSTDB}"
fi

# Spring Boot on internal port 8081
java -Dserver.port=8081 -jar /app/backend.jar &
BACKEND_PID=$!

# Next.js on Railway's public PORT (defaults to 8080)
# Next.js rewrites proxy /api/* to Spring Boot on 8081
cd /app/frontend
PORT=${PORT:-8080} node server.js &
FRONTEND_PID=$!

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
exit $?
