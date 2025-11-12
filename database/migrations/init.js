// ============================================ 
// MIGRATIONS - Estrutura inicial do banco
// Local: database/migrations/init.js
// ============================================
const db = require('../db');

/**
 * Cria as tabelas iniciais do banco de dados
 */
function initDatabase() {
    try {
        console.log('\nCriando estrutura do banco de dados...\n');
    
    // Tabela de Pedidos Especiais
    // Esta tabela armazena todos os pedidos especiais feitos na empresa.

        db.exec(`
            CREATE TABLE IF NOT EXISTS pedidos_especiais (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_pessoa TEXT NOT NULL,
                status TEXT DEFAULT 'pendente',
                cpf TEXT,
                tipo_gas TEXT NOT NULL,
                quantidade INTEGER NOT NULL,
                volume_por_kg REAL,
                valor_recarga REAL,
                desconto REAL DEFAULT 0.0,
                valor_total REAL,
                data_recebimento DATE,
                data_envio DATE,
                data_entrega DATE,
                status_pagamento TEXT DEFAULT 'pendente',
                observacoes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    
        console.log('Estrutura do banco criada com sucesso (apenas Pedidos Especiais)!\n');
    } catch (error) {
            console.error('❌ Erro ao inicializar o banco de dados:', error);
            throw error;
    }
}

// Executa a inicialização do banco de dados quando o módulo é carregado.
initDatabase();

// Exporta a função initDatabase para que possa ser usada em outros módulos, se necessário.
module.exports = { initDatabase };
