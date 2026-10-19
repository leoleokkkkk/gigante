# 📦 PACOTE DE DUPLICAÇÃO E MIGRAÇÃO DO BANCO DE DADOS
### **GIGANTE'S MULTIMARCAS — ORIGINAL É AQUI**

Este diretório contém **tudo o que você precisa** para clonar, transferir, duplicar e rodar o banco de dados completo do sistema **Gigante's Multimarcas** em qualquer outra aplicação, servidor ou banco relacional.

---

## 📁 Conteúdo do Pacote

| Arquivo | Descrição |
|---|---|
| `data.json` | Dump completo de todos os dados em formato JSON nativo (produtos, variações, pedidos, caixas, CRM, configurações). |
| `schema.sql` | Script DDL relacional padrão SQL (PostgreSQL, SQLite, MySQL) criando todas as 20 tabelas, chaves primárias, estrangeiras e índices. |
| `seed.sql` | Script de carga completo com todos os `INSERT INTO` contendo o catálogo real, histórico de pedidos, grade e configurações. |
| `schema.prisma` | Esquema pronto para uso com **Prisma ORM** em qualquer projeto Node.js, Next.js ou NestJS. |
| `import_clone.js` | Script CLI para duplicar o banco de dados para outra pasta com 1 comando. |
| `generate_seed_sql.js` | Utilitário para re-gerar o `seed.sql` caso você faça novas alterações na loja. |

---

## 🚀 Como Duplicar em Outra Aplicação

### 1. Clonar para outra aplicação igual (Next.js / Node.js)
Se você estiver subindo uma cópia da aplicação em outro servidor ou pasta, basta copiar o arquivo `data.json` para o destino:

```bash
# Método automático via script:
node database_export/import_clone.js "../minha-nova-loja/src/data/store.json"

# Ou simplesmente copie manualmente:
cp database_export/data.json ../minha-nova-loja/src/data/store.json
```

---

### 2. Migrar para PostgreSQL / Supabase / Neon / AWS RDS

Se você quiser subir o banco inteiro no **PostgreSQL** ou **Supabase**:

1. Acesse seu terminal ou o painel SQL do Supabase.
2. Execute o esquema de tabelas:
   ```bash
   psql -h seu_host -U seu_usuario -d seu_banco -f database_export/schema.sql
   ```
3. Execute a carga de dados:
   ```bash
   psql -h seu_host -U seu_usuario -d seu_banco -f database_export/seed.sql
   ```
Pronto! Todas as tabelas, produtos, variações, pedidos e movimentações financeiras estarão criadas e populadas.

---

### 3. Migrar para MySQL / MariaDB

1. No terminal do MySQL ou via phpMyAdmin / MySQL Workbench:
   ```bash
   mysql -u root -p seu_banco < database_export/schema.sql
   mysql -u root -p seu_banco < database_export/seed.sql
   ```

---

### 4. Usar com SQLite (Desktop / Local / Servidor leve)

Se quiser gerar um arquivo `.db` do SQLite imediatamente:
```bash
sqlite3 gigante.db < database_export/schema.sql
sqlite3 gigante.db < database_export/seed.sql
```
Você terá o arquivo `gigante.db` pronto para usar com Drizzle ORM, Better-SQLite3 ou Python.

---

### 5. Usar com Prisma ORM

1. Copie o arquivo `database_export/schema.prisma` para a pasta `prisma/schema.prisma` da sua nova aplicação.
2. Configure seu `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/gigante_db?schema=public"
   ```
3. Execute a migração do Prisma:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

---

## 📊 Estrutura das Tabelas Incluídas

1. **`categories`**: Categorias do catálogo (Tênis, Roupas, Acessórios).
2. **`subcategories`**: Subcategorias (Casual, Skate, Corrida, Camisetas, Moletons, Bonés).
3. **`brands`**: Marcas oficiais (Nike, Adidas, Jordan, Vans, Puma, New Balance, Mizuno, Converse, Fila, Olympikus).
4. **`products`**: Tênis e roupas com dimensões para frete, preço de custo, venda, promoção, SKU base e códigos de barras EAN-13.
5. **`product_images`**: Galeria de fotos de alta definição de cada produto.
6. **`product_variants`**: Grade de tamanhos (38 a 44, P ao GG), SKU individual, código de barras e estoque unitário.
7. **`customers`**: Cadastro de clientes (CRM), histórico de compras e LTV.
8. **`customer_addresses`**: Endereços de entrega e faturamento.
9. **`cash_registers`**: Sessões de caixa diário (abertura, fechamento, conferência cega, saldos em dinheiro, Pix, cartão).
10. **`cash_movements`**: Sangrias e suprimentos com justificativa e operador.
11. **`orders`**: Pedidos completos da loja virtual e PDV Balcão com frete, cálculo CMV, lucro líquido e status.
12. **`order_items`**: Itens e variantes vendidos por pedido.
13. **`order_tracking_events`**: Histórico detalhado de despacho e rastreamento de envios.
14. **`inventory_movements`**: Trilha Kardex de entradas, saídas por venda, devoluções e ajustes manuais.
15. **`financial_transactions`**: DRE e fluxo de caixa com receitas, custos e despesas operacionais.
16. **`returns`**: Sistema de logística reversa e trocas.
17. **`coupons`**: Cupons de desconto ativos e regras de uso.
18. **`banners`**: Banners promocionais do carrossel da home.
19. **`store_settings`**: Dados cadastrais da loja, CNPJ, Chave Pix, regras de frete e WhatsApp.
20. **`audit_logs`**: Trilha de segurança e auditoria de ações no sistema.
