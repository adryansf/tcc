use sqlx::postgres::PgConnection;
use super::entity::ClientEntity;
use super::super::super::database;

pub struct ClientRepository {
    pub db: PgConnection,
}

impl ClientRepository {
    pub async fn new() -> Self {
        Self { db: database::connect::connect().await.expect("Falha ao conectar ao banco") }
    }

    pub async fn find_by_cpf(&mut self, cpf: &str) -> Option<ClientEntity> {
        sqlx::query_as::<_,ClientEntity>(r#"
            SELECT 
                c.id, 
                c.cpf as cpf,
                c.nome AS nome,
                c.telefone AS telefone,
                c."dataDeNascimento" AS "dataDeNascimento",
                c.email AS email,
                c.senha AS senha,
                c."dataDeCriacao" AS "dataDeCriacao",
                c."dataDeAtualizacao" AS "dataDeAtualizacao",
                CASE 
                    WHEN e.id IS NOT NULL THEN 
                        json_build_object(
                            'logradouro', e.logradouro,
                            'numero', e.numero,
                            'bairro', e.bairro,
                            'cidade', e.cidade,
                            'uf', e.uf,
                            'complemento', e.complemento,
                            'cep', e.cep,
                            'dataDeCriacao', e."dataDeCriacao",
                            'dataDeAtualizacao', e."dataDeAtualizacao"
                        ) 
                    ELSE NULL 
                END AS endereco 
            FROM "Cliente" c
            LEFT JOIN "Endereco" e ON e."idCliente" = c.id
            WHERE c.cpf = $1 LIMIT 1
            "#).bind(cpf).fetch_optional(&mut self.db).await.unwrap()
    }
}