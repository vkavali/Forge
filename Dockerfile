FROM node:20-alpine AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY frontend/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM eclipse-temurin:21-jdk AS backend-build
WORKDIR /app/backend
COPY backend/.mvn .mvn
COPY backend/mvnw .
RUN chmod +x mvnw
COPY backend/pom.xml .
RUN ./mvnw dependency:go-offline -B
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:21-jre
RUN apt-get update && apt-get install -y --no-install-recommends nodejs npm curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Backend
COPY --from=backend-build /app/backend/target/*.jar backend.jar

# Frontend
COPY --from=frontend-build /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-build /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-build /app/frontend/public ./frontend/public

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8080 3000
ENTRYPOINT ["./start.sh"]
