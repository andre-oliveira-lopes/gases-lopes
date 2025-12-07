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
                -- Informações do Cliente (Pessoa Física ou Jurídica)
                tipo_cliente TEXT NOT NULL DEFAULT 'PF', -- 'PF' para Pessoa Física, 'PJ' para Pessoa Jurídica
                nome_pessoa TEXT,                        -- Nome da pessoa física (usado se tipo_cliente = 'PF')
                cpf TEXT,                                -- CPF da pessoa física (usado se tipo_cliente = 'PF')
                nome_empresa TEXT,                       -- Nome da empresa (usado se tipo_cliente = 'PJ')
                cnpj TEXT,                               -- CNPJ da empresa (usado se tipo_cliente = 'PJ')

                -- Informações do Fornecedor (abordagem simples inicial)
                fornecedor_nome TEXT,                    -- Nome do fornecedor associado ao pedido

                -- Detalhes do Pedido
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
                status TEXT DEFAULT 'pendente',
                observacoes TEXT,

                -- Controle de Deleção Lógica (Soft Delete)
                ocultarPedido INTEGER NOT NULL DEFAULT 0, -- 0 = visível (não oculto), 1 = oculto (apagado visualmente)

                -- Timestamps de Auditoria
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            -- ============================================
            -- CRIAÇÃO DE ÍNDICES PARA PERFORMANCE A LONGO PRAZO
            -- ============================================
            -- Índice para o campo de soft delete, crucial para todas as consultas de listagem
            CREATE INDEX IF NOT EXISTS idx_pedidos_ocultarPedido ON pedidos_especiais(ocultarPedido);

            -- Índice para o status do pedido, útil para filtros e relatórios
            CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos_especiais(status);

            -- Índice para a data de criação, essencial para ordenação e filtros por período
            CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos_especiais(created_at DESC); -- DESC para ordenação mais comum

            -- Índices para CPF e CNPJ, úteis para buscas rápidas de clientes
            CREATE INDEX IF NOT EXISTS idx_pedidos_cpf ON pedidos_especiais(cpf);
            CREATE INDEX IF NOT EXISTS idx_pedidos_cnpj ON pedidos_especiais(cnpj);

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
