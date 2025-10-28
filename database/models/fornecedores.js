// ============================================
// MODEL: Fornecedores
// Local: database/models/fornecedores.js
// ============================================

const db = require('../db');

/**
 * Cria um novo fornecedor
 */
function criarFornecedor(fornecedor) {
    const stmt = db.prepare(`
        INSERT INTO fornecedores (nome, cnpj, telefone, email, endereco)
        VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        fornecedor.nome,
        fornecedor.cnpj || null,
        fornecedor.telefone || null,
        fornecedor.email || null,
        fornecedor.endereco || null
    );

    return result.lastInsertRowid;
}

/**
 * Lista todos os fornecedores
 */
function listarFornecedores() {
    const stmt = db.prepare('SELECT * FROM fornecedores ORDER BY nome');
    return stmt.all();
}

/**
 * Busca fornecedor por ID
 */
function buscarFornecedorPorId(id) {
    const stmt = db.prepare('SELECT * FROM fornecedores WHERE id = ?');
    return stmt.get(id);
}

/**
 * Busca fornecedor por CNPJ
 */
function buscarFornecedorPorCNPJ(cnpj) {
    const stmt = db.prepare('SELECT * FROM fornecedores WHERE cnpj = ?');
    return stmt.get(cnpj);
}

/**
 * Atualiza um fornecedor
 */
function atualizarFornecedor(id, dados) {
    const campos = [];
    const valores = [];

    Object.keys(dados).forEach(key => {
        campos.push(`${key} = ?`);
        valores.push(dados[key]);
    });

    valores.push(id);

    const stmt = db.prepare(`
        UPDATE fornecedores 
        SET ${campos.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    return stmt.run(...valores);
}

/**
 * Deleta um fornecedor
 */
function deletarFornecedor(id) {
    const stmt = db.prepare('DELETE FROM fornecedores WHERE id = ?');
    return stmt.run(id);
}

/**
 * Busca fornecedores por nome
 */
function buscarFornecedores(termo) {
    const stmt = db.prepare(`
        SELECT * FROM fornecedores 
        WHERE nome LIKE ? OR cnpj LIKE ?
        ORDER BY nome
    `);

    const termoBusca = `%${termo}%`;
    return stmt.all(termoBusca, termoBusca);
}

module.exports = {
    criarFornecedor,
    listarFornecedores,
    buscarFornecedorPorId,
    buscarFornecedorPorCNPJ,
    atualizarFornecedor,
    deletarFornecedor,
    buscarFornecedores
};