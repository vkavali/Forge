#!/bin/bash

# Railway provides PORT env var - backend uses it
# Frontend runs on 3000 internally
export SERVER_PORT=${PORT:-8080}

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
