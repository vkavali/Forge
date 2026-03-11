#!/bin/bash

# Railway provides PORT env var - backend uses it
# Frontend runs on 3000 internally
export SERVER_PORT=${PORT:-8080}

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

# Start the Spring Boot backend on Railway's PORT
java -Dserver.port=$SERVER_PORT -jar /app/backend.jar &
BACKEND_PID=$!

# Start the Next.js frontend on port 3000
cd /app/frontend
node server.js &
FRONTEND_PID=$!

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
exit $?
