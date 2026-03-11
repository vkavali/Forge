#!/bin/sh

# Start the Spring Boot backend
java -jar /app/backend.jar &

# Start the Next.js frontend
cd /app/frontend
PORT=3000 node server.js &

# Wait for either process to exit
wait -n
exit $?
