package main

import (
	"log"
	"os"
	"tcc/internal/database"
	"tcc/internal/modules/account"
	"tcc/internal/modules/address"
	"tcc/internal/modules/admin"
	"tcc/internal/modules/auth"
	"tcc/internal/modules/branch"
	"tcc/internal/modules/client"
	"tcc/internal/modules/transaction"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			panic("Error loading .env file")
		}
	}

	server := fiber.New()

	// CORS
	server.Use(cors.New(cors.Config{
    AllowOrigins: "*",
	}))

	if err := database.Connect(); err != nil {
		panic(err)
	}
	defer database.Close()

	// Load Modules
	auth.AuthModule(server)
	client.ClientModule(server)
	address.AddressModule(server)
	branch.BranchModule(server)
	account.AccountModule(server)
	transaction.TransactionModule(server)
	admin.AdminModule(server)

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3333" // Porta padrão
	}

	log.Fatal(server.Listen(":" + port))
}