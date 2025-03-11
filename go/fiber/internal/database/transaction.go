package database

import (
	"database/sql"
	"log"
)

// StartTransaction inicia uma nova transação
func StartTransaction(db *sql.DB) (*sql.Tx, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}
	return tx, nil
}

// EndTransaction encerra a transação, fazendo commit se não houver erro e rollback se houver erro
func EndTransaction(tx *sql.Tx, err error) bool {
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			log.Printf("erro ao fazer rollback: %v", rbErr)
			return false
		}
	} else {
		if cmErr := tx.Commit(); cmErr != nil {
			log.Printf("erro ao fazer commit: %v", cmErr)
			return false
		}
	}

	return true
}
