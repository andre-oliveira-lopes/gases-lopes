// ============================================
// MIGRATIONS - Estrutura inicial do banco
// Local: database/migrations/init.js
// ============================================

const db = require('../db');

/**
 * Cria as tabelas iniciais do banco de dados
 */
function initDatabase() {
    console.log('🔄 Criando estrutura do banco de dados...');

    // Tabela de Fornecedores
    db.exec(`
        CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT UNIQUE,
            telefone TEXT,
            email TEXT,
            endereco TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de Cilindros
    db.exec(`
        CREATE TABLE IF NOT EXISTS cilindros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            tipo TEXT NOT NULL,
            capacidade REAL NOT NULL,
            pressao_max REAL,
            status TEXT DEFAULT 'disponivel',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de Pedidos Especiais
    db.exec(`
        CREATE TABLE IF NOT EXISTS pedidos_especiais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fornecedor_id INTEGER,
            descricao TEXT NOT NULL,
            quantidade INTEGER NOT NULL,
            valor_total REAL,
            status TEXT DEFAULT 'pendente',
            data_pedido DATE DEFAULT CURRENT_DATE,
            data_entrega DATE,
            observacoes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
        )
    `);

    // Tabela de Notas de Entrega
    db.exec(`
        CREATE TABLE IF NOT EXISTS notas_entrega (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_nota TEXT UNIQUE NOT NULL,
            cliente_nome TEXT NOT NULL,
            data_entrega DATE DEFAULT CURRENT_DATE,
            valor_total REAL,
            itens TEXT, -- JSON com os itens
            status TEXT DEFAULT 'emitida',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de Notas de Empréstimo
    db.exec(`
        CREATE TABLE IF NOT EXISTS notas_emprestimo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_nota TEXT UNIQUE NOT NULL,
            cliente_nome TEXT NOT NULL,
            cilindro_id INTEGER,
            data_emprestimo DATE DEFAULT CURRENT_DATE,
            data_devolucao_prevista DATE,
            data_devolucao_real DATE,
            status TEXT DEFAULT 'emprestado',
            observacoes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cilindro_id) REFERENCES cilindros(id)
        )
    `);

    // Tabela de Preços
    db.exec(`
        CREATE TABLE IF NOT EXISTS tabela_precos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto TEXT NOT NULL,
            tipo TEXT NOT NULL,
            preco REAL NOT NULL,
            unidade TEXT DEFAULT 'unidade',
            ativo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('✅ Estrutura do banco criada com sucesso!');
}

// Executa a inicialização
initDatabase();

module.exports = { initDatabase };