# Pontos de Interesse por GPS
## Enunciado
A XY Inc. é uma empresa especializada na produção de excelentes receptores GPS (Global Positioning System).
A diretoria está empenhada em lançar um dispositivo inovador que promete auxiliar pessoas na localização de pontos de interesse (POIs), e precisa muito de sua ajuda.
Você foi contratado para desenvolver a plataforma que fornecerá toda a inteligência ao dispositivo! Esta plataforma deve ser baseada em serviços REST, de forma a flexibilizar a integração.

1. Construa um serviço para cadastrar pontos de interesse, com 3 atributos: Nome do POI, coordenada X (inteiro não negativo) e coordenada Y (inteiro não negativo). Os POIs devem ser armazenados em uma base de dados.

2. Construa um serviço para listar todos os POIs cadastrados.

3. Construa um serviço para listar POIs por proximidade. Este serviço receberá uma coordenada X e uma coordenada Y, especificando um ponto de referência, bem como uma distância máxima (d-max) em metros. O serviço deverá retornar todos os POIs da base de dados que estejam a uma distância menor ou igual a d-max a partir do ponto de referência.

#### Exemplo de Base de Dados:

- 'Lanchonete' (x=27, y=12)
- 'Posto' (x=31, y=18)
- 'Joalheria' (x=15, y=12)
- 'Floricultura' (x=19, y=21)
- 'Pub' (x=12, y=8)
- 'Supermercado' (x=23, y=6)
- 'Churrascaria' (x=28, y=2)

#### Exemplo de Uso:
Dado o ponto de referência (x=20, y=10) indicado pelo receptor GPS, e uma distância máxima de 10 metros, o serviço deve retornar os seguintes POIs:

 - Lanchonete
 - Joalheria
 - Pub
 - Supermercado

### Autor do desafio
Desafio do [backend-br](https://github.com/backend-br/desafios)

## Implementação do Desafio 

### Estrutura da base de dados
A base de dados foi implementada usando SQLite, e a estrutura da tabela é a seguinte:

```sql
create table if not exists pontoDeInteresse (
  id INTEGER PRIMARY KEY, -- id do ponto de interesse
  nome varchar(255) not null unique, -- nome do ponto de interesse
  descricao varchar(255), -- descrição do ponto de interesse
  latitude decimal(10,8) not null, -- 10 para o caso de latitude negativa
  longitude decimal(11,8) not null -- 11 para o caso de longitude negativa
);
```

### Estrutura do projeto
O projeto foi implementado usando o Express, e a estrutura do projeto é a seguinte:

```bash
├── README.md
├── index.js
├── package.json
├── package-lock.json
├── database
│   └── database.db
│   └── database.sql # script para criar a tabela
│   └── inserts.sql # script para inserir alguns pontos de interesse
├── node_modules
```

### Como executar
Para executar o projeto, basta executar o comando `npm start` na raiz do projeto.

### Como usar
Para usar o projeto, basta executar o comando `npm start` na raiz do projeto, e acessar a url `http://localhost:3000/` no seu navegador.

### Como usar a API
A API possui 3 endpoints:

- `GET /interess` - retorna todos os pontos de interesse cadastrados
    - Parametros:
      - Obriatórios:
        - `lat` - latitude do ponto de referência
        - `long` - longitude do ponto de referência
      - Opcionais:
        - `maxDistance` - distância máxima em metros
        - `showDistance` - se deve mostrar a distância em metros do ponto de interesse até o ponto de referência	
        - `orderBy` - ordenar por `name` ou `distance`
    - Possiveis respostas:
      - `200` - OK (retorna um array de pontos de interesse)
      - `400` - Bad Request (parâmetros inválidos)
      - `500` - Internal Server Error (erro interno do servidor)
- `POST /interess` - cadastra um novo ponto de interesse
    - Parametros:
      - Obriatórios:
        - `nome` - nome do ponto de interesse
        - `latitude` - latitude do ponto de interesse
        - `longitude` - longitude do ponto de interesse
      - Opcionais:
        - `descricao` - descrição do ponto de interesse
    - Possiveis respostas:
      - `201` - Created (ponto de interesse cadastrado com sucesso)
      - `400` - Bad Request (parâmetros inválidos)
      - `500` - Internal Server Error (erro interno do servidor)
- `PUT /interess` - atualiza um ponto de interesse
    - Parametros: (pelo menos um dos parâmetros deve ser informado)
      - `nome` - nome do ponto de interesse
      - `latitude` - latitude do ponto de interesse
      - `longitude` - longitude do ponto de interesse
      - `descricao` - descrição do ponto de interesse
    - Possiveis respostas:
      - `200` - OK (ponto de interesse atualizado com sucesso)
      - `400` - Bad Request (parâmetros inválidos)
      - `500` - Internal Server Error (erro interno do servidor)
- `Delete /interess` - deleta um ponto de interesse
    - Parametros: (pelo menos um dos parâmetros deve ser informado)
      - `nome` - nome do ponto de interesse
      - `latitude` - latitude do ponto de interesse
      - `longitude` - longitude do ponto de interesse
      - `descricao` - descrição do ponto de interesse
    - Possiveis respostas:
      - `200` - OK (ponto de interesse deletado com sucesso)
      - `400` - Bad Request (parâmetros inválidos)
      - `500` - Internal Server Error (erro interno do servidor)

