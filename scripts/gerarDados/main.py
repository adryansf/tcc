import csv
import uuid
import random
from faker import Faker
from datetime import datetime
from validate_docbr import CPF  # Biblioteca para gerar CPFs válidos

# Inicialização do Faker
fake = Faker("pt_BR")

# Configurações
NUM_CLIENTES = 125000
NUM_CONTAS = NUM_CLIENTES  # Uma conta por cliente
NUM_GERENTES = 100
SENHA_PADRAO = "SenhaForte123"

# Criar apenas uma agência fixa
AGENCIA_ID = str(uuid.uuid4())
AGENCIA_NOME = "Agência Central"
AGENCIA_TELEFONE = fake.numerify(text="###########")  # Telefone de 11 dígitos
AGENCIA_NUMERO = random.randint(1000, 9999)
AGENCIA_CRIACAO = datetime.now().isoformat()

# Geração de CPFs válidos
cpf_generator = CPF()

def gerar_clientes():
    """Gera clientes fictícios com CPFs e e-mails únicos, e telefones no formato correto."""
    clientes = []
    cpfs_gerados = set()
    emails_gerados = set()

    for _ in range(NUM_CLIENTES):
        cpf_valido = cpf_generator.generate().replace(".", "").replace("-", "")  # CPF sem caracteres especiais
        while cpf_valido in cpfs_gerados:
            cpf_valido = cpf_generator.generate().replace(".", "").replace("-", "")
        cpfs_gerados.add(cpf_valido)

        email = fake.email()
        while email in emails_gerados:
            email = fake.email()
        emails_gerados.add(email)

        clientes.append([
            str(uuid.uuid4()), cpf_valido, email, fake.name(),
            fake.numerify(text="###########"),  # Telefone de 11 dígitos
            fake.date_of_birth(minimum_age=18, maximum_age=90), SENHA_PADRAO,
            datetime.now().isoformat(), datetime.now().isoformat()
        ])
    return clientes

def gerar_enderecos(clientes):
    """Gera um endereço para cada cliente."""
    enderecos = []
    for cliente in clientes:
        enderecos.append([
            str(uuid.uuid4()), fake.street_name(), str(fake.random_int(min=1, max=9999)),
            fake.bairro(), fake.city(), fake.estado_sigla(),
            fake.numerify(text="########"), cliente[0],
            datetime.now().isoformat(), datetime.now().isoformat()
        ])
    return enderecos

def gerar_gerentes():
    """Gera gerentes com CPFs e e-mails únicos, vinculados à agência fixa."""
    gerentes = []
    cpfs_gerados = set()
    emails_gerados = set()

    for _ in range(NUM_GERENTES):
        cpf_valido = cpf_generator.generate().replace(".", "").replace("-", "")
        while cpf_valido in cpfs_gerados:
            cpf_valido = cpf_generator.generate().replace(".", "").replace("-", "")
        cpfs_gerados.add(cpf_valido)

        email = fake.email()
        while email in emails_gerados:
            email = fake.email()
        emails_gerados.add(email)

        gerentes.append([
            str(uuid.uuid4()), AGENCIA_ID, cpf_valido, email, fake.name(),
            fake.numerify(text="###########"), fake.date_of_birth(minimum_age=30, maximum_age=60),
            SENHA_PADRAO, datetime.now().isoformat(), datetime.now().isoformat()
        ])
    return gerentes

def gerar_contas(clientes):
    """Gera contas bancárias, garantindo que cada cliente tenha uma conta."""
    contas = []
    numeros_contas = set()

    for cliente in clientes:
        num_conta = fake.random_int(min=100000, max=999999)
        while num_conta in numeros_contas:
            num_conta = fake.random_int(min=100000, max=999999)
        numeros_contas.add(num_conta)

        contas.append([
            str(uuid.uuid4()), num_conta, 1000.00,  # Saldo inicial de R$1000
            random.choice(["CORRENTE", "POUPANCA"]), AGENCIA_ID, cliente[0],
            datetime.now().isoformat(), datetime.now().isoformat()
        ])
    return contas

def gerar_transacoes(contas):
    """Gera uma transação de depósito inicial de R$1000 para cada conta."""
    transacoes = []
    for conta in contas:
        transacoes.append([
            str(uuid.uuid4()), 1000.00, "DEPOSITO", None, conta[0], datetime.now().isoformat()
        ])
    return transacoes

def salvar_csv(nome_arquivo, dados, colunas):
    """Salva os dados gerados em arquivos CSV."""
    with open(nome_arquivo, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(colunas)
        writer.writerows(dados)

# Gerar os dados fictícios
clientes = gerar_clientes()
enderecos = gerar_enderecos(clientes)
gerentes = gerar_gerentes()
contas = gerar_contas(clientes)
transacoes = gerar_transacoes(contas)

# Criar estrutura da agência
agencia = [[AGENCIA_ID, AGENCIA_NOME, AGENCIA_TELEFONE, AGENCIA_NUMERO, AGENCIA_CRIACAO, AGENCIA_CRIACAO]]

# Salvar os arquivos CSV
salvar_csv("Agencia.csv", agencia, ["id", "nome", "telefone", "numero", "dataDeCriacao", "dataDeAtualizacao"])
salvar_csv("Cliente.csv", clientes, ["id", "cpf", "email", "nome", "telefone", "dataDeNascimento", "senha", "dataDeCriacao", "dataDeAtualizacao"])
salvar_csv("Endereco.csv", enderecos, ["id", "logradouro", "numero", "bairro", "cidade", "uf", "cep", "idCliente", "dataDeCriacao", "dataDeAtualizacao"])
salvar_csv("Gerente.csv", gerentes, ["id", "idAgencia", "cpf", "email", "nome", "telefone", "dataDeNascimento", "senha", "dataDeCriacao", "dataDeAtualizacao"])
salvar_csv("Conta.csv", contas, ["id", "numero", "saldo", "tipo", "idAgencia", "idCliente", "dataDeCriacao", "dataDeAtualizacao"])
salvar_csv("Transacao.csv", transacoes, ["id", "valor", "tipo", "idContaOrigem", "idContaDestino", "dataDeCriacao"])

print("Arquivos CSV gerados com sucesso!")

### **🔍 Validação Final**
print("\n🔍 Validando restrições antes da importação...\n")

# Valida unicidade de CPF e e-mail
def verificar_unicidade(lista, indice, campo):
    valores = set()
    for item in lista:
        if item[indice] in valores:
            print(f"Erro: {campo} duplicado encontrado -> {item[indice]}")
        valores.add(item[indice])

verificar_unicidade(clientes, 1, "CPF Cliente")
verificar_unicidade(clientes, 2, "E-mail Cliente")
verificar_unicidade(gerentes, 2, "CPF Gerente")
verificar_unicidade(gerentes, 3, "E-mail Gerente")
verificar_unicidade(contas, 1, "Número de Conta")

# Valida referências nas transações
ids_contas = {c[0] for c in contas}
for transacao in transacoes:
    if transacao[4] not in ids_contas:
        print(f"Erro: Transação com conta inexistente! ID: {transacao[0]}")

print("\n✅ Validação concluída! Nenhum erro encontrado." if not any([clientes, contas]) else "⚠️ Corrija os erros antes da importação.")
