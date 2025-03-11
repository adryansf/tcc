package main

import (
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

	db, err := database.Connect()

	if err != nil {
		panic(err)
	}

	// Load Modules
	auth.AuthModule(server, db)
	client.ClientModule(server, db)
	address.AddressModule(server, db)
	branch.BranchModule(server, db)
	account.AccountModule(server, db)
	transaction.TransactionModule(server, db)
	admin.AdminModule(server, db)

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3333" // Porta padrão
	}

	server.Listen(":" + port)
}