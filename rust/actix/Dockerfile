# Usar uma imagem base do Rust
FROM rust:1.86.0-slim-bullseye as build

ARG APP_NAME=tcc

WORKDIR /build

# Instalar dependências necessárias
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev && \
    rm -rf /var/lib/apt/lists/*

COPY Cargo.toml ./
RUN mkdir src \
    && echo "// dummy file" > src/lib.rs \
    && cargo build --release

COPY src src
RUN cargo build --locked --release
RUN cp ./target/release/$APP_NAME /bin/server

FROM debian:bullseye-slim AS final
COPY --from=build /bin/server /bin/
CMD ["/bin/server"]
