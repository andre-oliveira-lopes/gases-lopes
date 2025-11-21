// ============================================
// MODELS: PEDIDOS ESPECIAIS - Funções de acesso ao banco de dados para Pedidos Especiais
// Local: database/models/pedidos-especiais.js
// ============================================
const db = require('../db');

const PedidosEspeciaisModel = {
    /**
     * Lista todos os pedidos especiais, opcionalmente com filtros.
     * @param {Object} filtros - Objeto com filtros (ex: { status: 'pendente', nome_pessoa: 'João' })
     * @returns {Array} Lista de pedidos especiais.
     */
    listarPedidos: (filtros = {}) => {
        let query = `SELECT * FROM pedidos_especiais`;
        const params = [];
        const conditions = [];

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
        // Adicione outros filtros conforme necessário aqui (ex: tipo_gas, cpf, etc.)

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }

        query += ` ORDER BY created_at DESC`; // Ordena pelos mais recentes

        return db.prepare(query).all(params);
    },

    /**
     * Cria um novo pedido especial.
     * @param {Object} pedido - Objeto com os dados do pedido.
     * @returns {Number} O ID do novo pedido criado.
     */
    criarPedido: (pedido) => {
        const {
            nome_pessoa,
            status,
            cpf,
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
            observacoes
        } = pedido;

        const result = db.prepare(`
            INSERT INTO pedidos_especiais (
                nome_pessoa, status, cpf, tipo_gas, quantidade, volume_por_kg,
                valor_recarga, desconto, valor_total, data_recebimento, data_envio,
                data_entrega, status_pagamento, observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            nome_pessoa,
            status || 'pendente', // Valor padrão se não fornecido
            cpf,
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
            observacoes
        );
        return result.lastInsertRowid;
    },

    /**
     * Busca um pedido especial pelo ID.
     * @param {Number} id - ID do pedido.
     * @returns {Object|undefined} O pedido encontrado ou undefined se não existir.
     */
    buscarPedidoPorId: (id) => {
        return db.prepare(`SELECT * FROM pedidos_especiais WHERE id = ?`).get(id);
    },

    /**
     * Atualiza um pedido especial existente.
     * @param {Number} id - ID do pedido a ser atualizado.
     * @param {Object} dados - Objeto com os dados a serem atualizados.
     */
    atualizarPedido: (id, dados) => {
        const updates = [];
        const params = [];

        // Itera sobre os dados fornecidos para construir a query de UPDATE
        for (const key in dados) {
            // Ignora 'id' e 'created_at' para evitar atualizações indevidas
            if (dados.hasOwnProperty(key) && key !== 'id' && key !== 'created_at') {
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

    /**
     * Deleta um pedido especial pelo ID.
     * @param {Number} id - ID do pedido a ser deletado.
     */
    deletarPedido: (id) => {
        db.prepare(`DELETE FROM pedidos_especiais WHERE id = ?`).run(id);
    },

    /**
     * Busca pedidos especiais por um termo de texto em campos relevantes.
     * @param {String} termo - Termo de busca.
     * @returns {Array} Lista de pedidos que correspondem ao termo.
     */
    buscarPedidos: (termo) => {
        const likeTerm = `%${termo}%`;
        return db.prepare(`
            SELECT * FROM pedidos_especiais
            WHERE nome_pessoa     LIKE ?
            OR tipo_gas        LIKE ?
            OR cpf             LIKE ?
            OR status          LIKE ?   -- <--- adicionamos o status aqui
            ORDER BY created_at DESC
        `).all(likeTerm, likeTerm, likeTerm, likeTerm);
    }
};

module.exports = PedidosEspeciaisModel;
