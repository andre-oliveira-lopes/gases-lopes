// ============================================
// DATABASE CONFIG - Configuração do SQLite
// Local: database/db.js
// ============================================

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Caminho do banco de dados
const DB_PATH = path.join(__dirname, '../data/gases-uniao.db');

// Cria a pasta data se não existir
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Conecta ao banco (cria se não existir)
const db = new Database(DB_PATH, {
    verbose: console.log // Remove em produção
});

// Habilita foreign keys
db.pragma('foreign_keys = ON');

console.log('✅ Banco de dados conectado:', DB_PATH);

// Exporta a instância do banco
module.exports = db;