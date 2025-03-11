package entity

type BranchEntity struct {
	ID              string    `json:"id"`
	Nome            string    `json:"nome"`
	Numero          int       `json:"numero"`
	Telefone        string    `json:"telefone"`
	DataDeCriacao   string `json:"dataDeCriacao"`
	DataDeAtualizacao string `json:"dataDeAtualizacao"`
}