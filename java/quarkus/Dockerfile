# 1️⃣ Etapa de construção (build)
FROM gradle:8.13.0-jdk21 AS build
WORKDIR /app
COPY . /app
RUN gradle build -x test

# 2️⃣ Etapa de execução (runtime)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/quarkus-app /app/

EXPOSE 8080
CMD ["java", "-jar", "quarkus-run.jar"]