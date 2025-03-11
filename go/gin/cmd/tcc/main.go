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

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}else{
		err := godotenv.Load()
		if err != nil {
			panic("Error loading .env file")
		}
	}
	

	server := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	
	// Cors
	server.Use(cors.New(config))

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

	server.Run(":" + port)
}