#!/bin/bash

# Parse Railway's DATABASE_URL into Spring Boot datasource env vars
if [ -n "$DATABASE_URL" ]; then
    DB_STRIPPED="${DATABASE_URL#postgresql://}"
    DB_USERPASS="${DB_STRIPPED%%@*}"
    DB_HOSTDB="${DB_STRIPPED#*@}"
    export SPRING_DATASOURCE_USERNAME="${DB_USERPASS%%:*}"
    export SPRING_DATASOURCE_PASSWORD="${DB_USERPASS#*:}"
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOSTDB}"
fi

# Generate nginx config with the Railway PORT
export PORT=${PORT:-8080}
envsubst '${PORT}' < /app/nginx.conf.template > /tmp/nginx.conf

# Start Spring Boot on internal port 8081
java -Dserver.port=8081 -jar /app/backend.jar &
BACKEND_PID=$!

# Start Next.js on internal port 3000
cd /app/frontend
PORT=3000 HOSTNAME=0.0.0.0 node server.js &
FRONTEND_PID=$!

# Start nginx on Railway's PORT (reverse proxy)
nginx -c /tmp/nginx.conf -g 'daemon off;' &
NGINX_PID=$!

# Wait for any process to exit
wait -n $BACKEND_PID $FRONTEND_PID $NGINX_PID 2>/dev/null || wait $BACKEND_PID $FRONTEND_PID $NGINX_PID
exit $?
