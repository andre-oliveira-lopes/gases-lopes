// ============================================
// MODELS: PEDIDOS ESPECIAIS - Funções de acesso ao banco de dados para Pedidos Especiais
// Local: database/models/pedidos-especiais.js
// ============================================
const db = require('../db');

const PedidosEspeciaisModel = {
    // ============================================
    // listarPedidos - Lista todos os pedidos especiais, opcionalmente com filtros.
    // ============================================
    /**
     * Lista todos os pedidos especiais, opcionalmente com filtros.
     * Agora inclui filtro para não mostrar pedidos ocultos (soft delete).
     * @param {Object} filtros - Objeto com filtros (ex: { status: 'pendente', nome_pessoa: 'João' })
     * @returns {Array} Lista de pedidos especiais.
     */
    listarPedidos: (filtros = {}) => {
        let query = `SELECT * FROM pedidos_especiais`;
        const params = [];
        const conditions = [];

        // --- FILTRO OBRIGATÓRIO: SOFT DELETE ---
        // Sempre filtra por pedidos que NÃO estão ocultos (ocultarPedido = 0)
        conditions.push(`ocultarPedido = 0`);

        // --- FILTROS OPCIONAIS ---
        // Exemplo de filtro: status
        if (filtros.status) {
            conditions.push(`status = ?`);
            params.push(filtros.status);
        }
        // Exemplo de filtro: nome_pessoa (parcial)
        if (filtros.nome_pessoa) {
            conditions.push(`nome_pessoa LIKE ?`);
            params.push(`%${filtros.nome_pessoa}%`);
        }
        // Novo filtro: nome_empresa (parcial)
        if (filtros.nome_empresa) {
            conditions.push(`nome_empresa LIKE ?`);
            params.push(`%${filtros.nome_empresa}%`);
        }
        // Novo filtro: cnpj (parcial)
        if (filtros.cnpj) {
            conditions.push(`cnpj LIKE ?`);
            params.push(`%${filtros.cnpj}%`);
        }
        // Novo filtro: fornecedor_nome (parcial)
        if (filtros.fornecedor_nome) {
            conditions.push(`fornecedor_nome LIKE ?`);
            params.push(`%${filtros.fornecedor_nome}%`);
        }
        // Adicione outros filtros conforme necessário aqui (ex: tipo_gas, cpf, etc.)
            // ============================================
        // NOVO: Filtro para ocultarPedido (permite flexibilidade)
        // ============================================
        if (typeof filtros.ocultarPedido !== 'undefined') {
            // Remove a condição fixa se o filtro específico foi passado
            const indexOcultar = conditions.indexOf('ocultarPedido = 0');
            if (indexOcultar > -1) {
                conditions.splice(indexOcultar, 1);
            }
            // Adiciona a condição com parâmetro
            conditions.push(`ocultarPedido = ?`);
            params.push(filtros.ocultarPedido);
        }
        // ============================================
        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(` AND `);
        }

        query += ` ORDER BY created_at DESC`; // Ordena pelos mais recentes

        console.log('📄 Query SQL:', query); // Para debug
        console.log('📄 Params:', params);   // Para debug

        return db.prepare(query).all(params);
    },

    // ============================================
    // criarPedido - Lidar com as novas colunas adicionadas
    // ============================================
    /**
     * Cria um novo pedido especial.
     * Agora aceita informações de Pessoa Física/Jurídica, fornecedor e define o status de soft delete.
     * @param {Object} pedido - Objeto com os dados do pedido.
     * @returns {Number} O ID do novo pedido criado.
     */
    criarPedido: (pedido) => {
        const {
            // Novas colunas para tipo de cliente e fornecedor
            tipo_cliente,
            nome_pessoa,
            cpf,
            nome_empresa,
            cnpj,
            fornecedor_nome,
            // Colunas existentes
            status,
            tipo_gas,
            quantidade,
            volume_por_kg,
            valor_recarga,
            desconto,
            valor_total,
            data_recebimento,
            data_envio,
            data_entrega,
            status_pagamento,
            observacoes,
            // Nova coluna para soft delete (com default 0 no DB)
            ocultarPedido
        } = pedido;

        const result = db.prepare(`
            INSERT INTO pedidos_especiais (
                tipo_cliente, nome_pessoa, cpf, nome_empresa, cnpj, fornecedor_nome,
                status, tipo_gas, quantidade, volume_por_kg, valor_recarga, desconto,
                valor_total, data_recebimento, data_envio, data_entrega,
                status_pagamento, observacoes, ocultarPedido
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            tipo_cliente || 'PF', // Garante 'PF' se não especificado (embora o DB já tenha DEFAULT)
            nome_pessoa,
            cpf,
            nome_empresa,
            cnpj,
            fornecedor_nome,
            status || 'pendente', // Valor padrão se não fornecido
            tipo_gas,
            quantidade,
            volume_por_kg,
            valor_recarga,
            desconto || 0.0, // Valor padrão se não fornecido
            valor_total,
            data_recebimento,
            data_envio,
            data_entrega,
            status_pagamento || 'pendente', // Valor padrão se não fornecido
            observacoes,
            ocultarPedido || 0 // Garante 0 (visível) se não especificado (embora o DB já tenha DEFAULT)
        );
        return result.lastInsertRowid;
    },

    // ============================================
    // buscarPedidoPorId - Incluir filtro de soft delete
    // ============================================
    /**
     * Busca um pedido especial pelo ID.
     * Agora garante que o pedido não esteja oculto (soft delete).
     * @param {Number} id - ID do pedido.
     * @returns {Object|undefined} O pedido encontrado ou undefined se não existir ou estiver oculto.
     */
    buscarPedidoPorId: (id) => {
        // Busca um pedido pelo ID, garantindo que não esteja oculto (soft delete)
        return db.prepare(`SELECT * FROM pedidos_especiais WHERE id = ? AND ocultarPedido = 0`).get(id);
    },

    // ============================================
    // atualizarPedido - Lidar com novas colunas e proteger 'ocultarPedido'
    // ============================================
    /**
     * Atualiza um pedido especial existente.
     * Agora ignora a atualização direta de 'ocultarPedido', que é controlada pela função de soft delete.
     * @param {Number} id - ID do pedido a ser atualizado.
     * @param {Object} dados - Objeto com os dados a serem atualizados.
     */
    atualizarPedido: (id, dados) => {
        const updates = [];
        const params = [];

        // Itera sobre os dados fornecidos para construir a query de UPDATE
        for (const key in dados) {
            // Ignora 'id', 'created_at' e 'ocultarPedido' para evitar atualizações indevidas
            if (dados.hasOwnProperty(key) && key !== 'id' && key !== 'created_at' && key !== 'ocultarPedido') {
                updates.push(`${key} = ?`);
                params.push(dados[key]);
            }
        }

        if (updates.length === 0) {
            console.warn('Nenhum dado para atualizar para o pedido', id);
            return; // Não há nada para atualizar
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`); // Garante que updated_at seja sempre atualizado

        params.push(id); // O ID é o último parâmetro para a cláusula WHERE

        db.prepare(`
            UPDATE pedidos_especiais
            SET ${updates.join(', ')}
            WHERE id = ?
        `).run(params);
    },

    // ============================================
    // deletarPedido - Implementação de Soft Delete
    // ============================================
    /**
     * "Deleta" um pedido especial pelo ID, marcando-o como oculto (soft delete).
     * O registro é mantido no banco de dados para auditoria e recuperação.
     * @param {Number} id - ID do pedido a ser "deletado".
     */
    deletarPedido: (id) => {
        // Em vez de deletar fisicamente, atualiza o campo 'ocultarPedido' para 1 (oculto)
        // Isso mantém o registro no banco para auditoria, mas o esconde do front-end
        db.prepare(`
            UPDATE pedidos_especiais
            SET ocultarPedido = 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(id);
    },

    // ============================================
    // buscarPedidos - Incluir filtro de soft delete e novas colunas na busca
    // ============================================
    /**
     * Busca pedidos especiais por um termo de texto em campos relevantes.
     * Agora inclui busca em nome da empresa, CNPJ e nome do fornecedor,
     * e filtra apenas por pedidos não ocultos (soft delete).
     * @param {String} termo - Termo de busca.
     * @returns {Array} Lista de pedidos que correspondem ao termo.
     */
    buscarPedidos: (termo) => {
        const likeTerm = `%${termo}%`;
        return db.prepare(`
            SELECT * FROM pedidos_especiais
            WHERE ocultarPedido = 0 -- Sempre filtra por pedidos não ocultos
              AND (
                   nome_pessoa     LIKE ?
                OR cpf             LIKE ?
                OR nome_empresa    LIKE ? -- Novo: busca por nome da empresa
                OR cnpj            LIKE ? -- Novo: busca por CNPJ
                OR fornecedor_nome LIKE ? -- Novo: busca por nome do fornecedor
                OR tipo_gas        LIKE ?
                OR status          LIKE ?
              )
            ORDER BY created_at DESC
        `).all(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm); // 7 parâmetros likeTerm agora
    }
};

module.exports = PedidosEspeciaisModel;
