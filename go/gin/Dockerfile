FROM golang:1.24.1

WORKDIR /go/src/app

COPY . .

EXPOSE 3333

RUN go build -o main cmd/tcc/main.go

CMD ["./main"]