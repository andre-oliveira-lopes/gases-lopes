// ============================================
// MODEL: Pedidos Especiais
// Local: database/models/pedidos.js
// ============================================

const db = require('../db');

/**
 * Cria um novo pedido especial
 */
function criarPedido(pedido) {
    const stmt = db.prepare(`
        INSERT INTO pedidos_especiais 
        (fornecedor_id, descricao, quantidade, valor_total, status, data_entrega, observacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        pedido.fornecedor_id || null,
        pedido.descricao,
        pedido.quantidade,
        pedido.valor_total || null,
        pedido.status || 'pendente',
        pedido.data_entrega || null,
        pedido.observacoes || null
    );

    return result.lastInsertRowid;
}

/**
 * Lista todos os pedidos
 */
function listarPedidos(filtros = {}) {
    let query = `
        SELECT 
            pe.*,
            f.nome as fornecedor_nome
        FROM pedidos_especiais pe
        LEFT JOIN fornecedores f ON pe.fornecedor_id = f.id
        WHERE 1=1
    `;

    const params = [];

    if (filtros.status) {
        query += ' AND pe.status = ?';
        params.push(filtros.status);
    }

    if (filtros.fornecedor_id) {
        query += ' AND pe.fornecedor_id = ?';
        params.push(filtros.fornecedor_id);
    }

    query += ' ORDER BY pe.created_at DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
}

/**
 * Busca um pedido por ID
 */
function buscarPedidoPorId(id) {
    const stmt = db.prepare(`
        SELECT 
            pe.*,
            f.nome as fornecedor_nome,
            f.telefone as fornecedor_telefone
        FROM pedidos_especiais pe
        LEFT JOIN fornecedores f ON pe.fornecedor_id = f.id
        WHERE pe.id = ?
    `);

    return stmt.get(id);
}

/**
 * Atualiza um pedido
 */
function atualizarPedido(id, dados) {
    const campos = [];
    const valores = [];

    Object.keys(dados).forEach(key => {
        campos.push(`${key} = ?`);
        valores.push(dados[key]);
    });

    valores.push(id);

    const stmt = db.prepare(`
        UPDATE pedidos_especiais 
        SET ${campos.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    return stmt.run(...valores);
}

/**
 * Deleta um pedido
 */
function deletarPedido(id) {
    const stmt = db.prepare('DELETE FROM pedidos_especiais WHERE id = ?');
    return stmt.run(id);
}

/**
 * Busca pedidos por texto
 */
function buscarPedidos(termo) {
    const stmt = db.prepare(`
        SELECT 
            pe.*,
            f.nome as fornecedor_nome
        FROM pedidos_especiais pe
        LEFT JOIN fornecedores f ON pe.fornecedor_id = f.id
        WHERE pe.descricao LIKE ? OR f.nome LIKE ?
        ORDER BY pe.created_at DESC
    `);

    const termoBusca = `%${termo}%`;
    return stmt.all(termoBusca, termoBusca);
}

module.exports = {
    criarPedido,
    listarPedidos,
    buscarPedidoPorId,
    atualizarPedido,
    deletarPedido,
    buscarPedidos
};