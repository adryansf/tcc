package client

import (
	"tcc/internal/database"
	"tcc/internal/modules/client/entity"
)

type ICreateClientData struct {
	Nome            string
	CPF             string
	Telefone        string
	DataDeNascimento string
	Email           string
	Senha           string
}

type ClientRepository struct{
}

func (r *ClientRepository) Create(data ICreateClientData) (*entity.ClientEntity, error) {
  client := &entity.ClientEntity{
    Nome: data.Nome,
    CPF: data.CPF,
    Telefone: data.Telefone,
    DataDeNascimento: entity.DateOnly(data.DataDeNascimento),
    Email: data.Email,
    Senha: data.Senha,
  }

  result := database.Conn.Create(client)

  if result.Error != nil {
    return nil, result.Error
  }

  return client, nil
}

func (r *ClientRepository) FindById(id string) (*entity.ClientEntity, error) {
  var client entity.ClientEntity
  result := database.Conn.Preload("Endereco").First(&client, "id = ?", id)

  if result.Error != nil {
    return nil, result.Error
  }

  return &client, nil
}

func (r *ClientRepository) FindByCPF(cpf string) (*entity.ClientEntity, error) {
  var client entity.ClientEntity
  result := database.Conn.Preload("Endereco").First(&client, "cpf = ?", cpf)

  if result.Error != nil {
    return nil, result.Error
  }

  return &client, nil
}

func (r *ClientRepository) FindByEmail(email string) (*entity.ClientEntity, error) {
  var client entity.ClientEntity
  result := database.Conn.Preload("Endereco").First(&client, "email = ?", email)

  if result.Error != nil {
    return nil, result.Error
  }

  return &client, nil
}

func (r *ClientRepository) FindAll(quantidade int) ([]*entity.ClientEntity, error) {
  var clients []*entity.ClientEntity
  result := database.Conn.Limit(quantidade).Find(&clients)

  if result.Error != nil {
    return nil, result.Error
  }

  return clients, nil
}