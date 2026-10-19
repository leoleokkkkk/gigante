/**
 * Script de Duplicação e Clone de Banco de Dados — Gigante's Multimarcas
 * 
 * Uso:
 *   node import_clone.js [caminho_destino]
 * 
 * Exemplo:
 *   node import_clone.js ../outro-app/src/data/store.json
 */

const fs = require('fs');
const path = require('path');

const targetArg = process.argv[2];
const sourceDataPath = path.join(__dirname, 'data.json');

if (!fs.existsSync(sourceDataPath)) {
  console.error('❌ Arquivo data.json não encontrado em:', sourceDataPath);
  process.exit(1);
}

if (!targetArg) {
  console.log(`
=============================================================================
  GIGANTE'S MULTIMARCAS — UTILITÁRIO DE DUPLICAÇÃO DE BANCO DE DADOS
=============================================================================

Este script duplica todo o banco de dados (catálogo, estoque, pedidos, caixa, etc.)
para qualquer outra pasta ou projeto.

Modo de uso:
  node import_clone.js <caminho_de_destino>

Exemplos:
  1. Clonar para outra aplicação Next.js:
     node import_clone.js "C:/projetos/meu-novo-app/src/data/store.json"

  2. Criar uma cópia de backup:
     node import_clone.js "./backup-store.json"

=============================================================================
`);
  process.exit(0);
}

const targetPath = path.resolve(targetArg);
const targetDir = path.dirname(targetPath);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(sourceDataPath, targetPath);
console.log(`✅ Banco de dados duplicado com sucesso para: ${targetPath}`);
console.log(`📊 Tamanho transferido: ${(fs.statSync(targetPath).size / 1024).toFixed(2)} KB`);
