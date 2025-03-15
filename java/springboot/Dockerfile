# 1️⃣ Etapa de construção (build)
FROM gradle:8.13.0-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar -x test

# 2️⃣ Etapa de execução (runtime)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
