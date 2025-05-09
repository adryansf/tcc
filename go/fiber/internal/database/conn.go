package database

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)


var Conn *pgxpool.Pool

func Connect() error {
	var (
		host     = os.Getenv("DB_HOST")
		port     = os.Getenv("DB_PORT")
		user     = os.Getenv("DB_USER")
		password = os.Getenv("DB_PASSWORD")
		dbname   = os.Getenv("DB_NAME")
	)

	url := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
	host, port, user, password, dbname)

	config, err := pgxpool.ParseConfig(url)
	if err != nil {
		return fmt.Errorf("erro ao analisar config: %w", err)
	}

	// Define min e max conexões
	config.MinConns = 20
	config.MaxConns = 20

	// Cria a pool com a configuração personalizada
	Conn, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return fmt.Errorf("erro ao criar pool: %w", err)
	}

	return nil
}

func Close() {
	if Conn == nil {
		return
	}
	Conn.Close()
}