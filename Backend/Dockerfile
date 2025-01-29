FROM eclipse-temurin:11-jdk-focal

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Fix: Grant execution permission to mvnw
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline

COPY src ./src

EXPOSE 8081

CMD ["./mvnw", "spring-boot:run"]
