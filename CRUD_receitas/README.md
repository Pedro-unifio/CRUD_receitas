# Caderno de receitas

Cada receita possui nome único; tempo de preparo e número de porções devem ser positivos. Projeto independente com interface web, Express, Sequelize, banco relacional SQLite e testes Jest.

## Executar

Na pasta deste projeto:

```bash
npm install
npm test
npm start
```

Abra http://localhost:3001. O arquivo `dados.sqlite` é criado automaticamente. Para mudar a porta use `PORT`; nos testes `DB_PATH=:memory:` isola o banco.

| Método | Rota | Ação |
| --- | --- | --- |
| GET | `/api/receitas` | Listar |
| GET | `/api/receitas/:id` | Buscar |
| POST | `/api/receitas` | Criar |
| PUT | `/api/receitas/:id` | Atualizar |
| DELETE | `/api/receitas/:id` | Excluir |

`npm test` exige cobertura acima de 90% para linhas, instruções, funções e ramos.
