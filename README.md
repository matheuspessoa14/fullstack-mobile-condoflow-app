# CondoFlow

O CondoFlow é uma aplicação mobile full stack para apoio à gestão de condomínios. O sistema reúne funcionalidades para moradores, porteiros e síndicos, com integração entre aplicativo mobile, API REST e banco de dados MySQL.

## Funcionalidades

* Login com validação no banco de dados
* Controle de acesso por perfil
* Cadastro e consulta de moradores
* Cadastro e consulta de visitantes
* Registro de encomendas
* Solicitação de reservas
* Registro e consulta de ocorrências
* Persistência de dados em MySQL

## Tecnologias

### Frontend

* React Native
* Expo
* TypeScript
* Axios

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven

### Banco de dados

* MySQL
* MySQL Workbench

## Estrutura do projeto

```text
fullstack-mobile-condoflow-app/
├── backend/
│   └── condoflow/
└── frontend/
```

## Como executar

### 1. Criar o banco de dados

```sql
CREATE DATABASE condoflow_db;
```

Configure o arquivo `application.properties` do backend:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/condoflow_db
spring.datasource.username=root
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8090
```

Substitua `SUA_SENHA` pela senha configurada no seu MySQL.

### 2. Iniciar o backend

Acesse a pasta:

```bash
cd backend/condoflow
```

No Windows:

```bash
.\mvnw.cmd spring-boot:run
```

Em Linux ou macOS:

```bash
./mvnw spring-boot:run
```

O backend será iniciado em:

```text
http://localhost:8090
```

### 3. Configurar a API no frontend

Para executar no emulador Android:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.0.2.2:8090/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Em um dispositivo físico, substitua `10.0.2.2` pelo endereço IP local do computador.

Exemplo:

```text
http://192.168.0.10:8090/api
```

### 4. Iniciar o frontend

Acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Para iniciar limpando o cache:

```bash
npx expo start -c
```

Depois, execute o projeto no emulador Android ou utilize o Expo Go em um dispositivo físico.

## Endpoints principais

```http
GET  /api/users
POST /api/users
POST /api/users/login

GET  /api/visitors
POST /api/visitors

GET  /api/packages
POST /api/packages

GET  /api/reservations
POST /api/reservations

GET  /api/occurrences
POST /api/occurrences
```

## Exemplo de cadastro de usuário

```http
POST http://localhost:8090/api/users
```

```json
{
  "name": "Matheus Pessoa",
  "email": "matheus@email.com",
  "password": "123456",
  "role": "morador"
}
```

Perfis aceitos:

```text
morador
porteiro
sindico
```

## Exemplo de login

```http
POST http://localhost:8090/api/users/login
```

```json
{
  "email": "matheus@email.com",
  "password": "123456"
}
```

## Autor

**Matheus Pessoa**

Estudante de Análise e Desenvolvimento de Sistemas - 4 Período

## Observação

Este projeto foi desenvolvido para fins acadêmicos. Melhorias futuras podem incluir autenticação com JWT, criptografia de senhas com BCrypt, testes automatizados e deploy da aplicação.
