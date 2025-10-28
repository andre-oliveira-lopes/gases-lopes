// ============================================
// PEDIDOS API - Funções para o frontend
// Local: assets/js/api/pedidos.js
// ============================================

const { ipcRenderer } = require('electron');

/**
 * API para gerenciar Pedidos Especiais
 */
const PedidosAPI = {
    /**
     * Lista todos os pedidos
     * @param {Object} filtros - Filtros opcionais (status, fornecedor_id)
     * @returns {Promise<Array>} Lista de pedidos
     */
    async listar(filtros = {}) {
        try {
            console.log('📋 Listando pedidos...', filtros);
            const pedidos = await ipcRenderer.invoke('pedidos:listar', filtros);
            console.log(`✅ ${pedidos.length} pedidos encontrados`);
            return pedidos;
        } catch (error) {
            console.error('❌ Erro ao listar pedidos:', error);
            throw new Error('Não foi possível carregar os pedidos');
        }
    },

    /**
     * Cria um novo pedido
     * @param {Object} pedido - Dados do pedido
     * @returns {Promise<Object>} Resultado com ID do pedido criado
     */
    async criar(pedido) {
        // Validação básica
        if (!pedido.descricao || !pedido.quantidade) {
            throw new Error('Descrição e quantidade são obrigatórios');
        }

        if (pedido.quantidade <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        try {
            console.log('➕ Criando pedido...', pedido);
            const result = await ipcRenderer.invoke('pedidos:criar', pedido);
            console.log('✅ Pedido criado com ID:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Erro ao criar pedido:', error);
            throw new Error('Não foi possível criar o pedido');
        }
    },

    /**
     * Busca um pedido por ID
     * @param {Number} id - ID do pedido
     * @returns {Promise<Object>} Dados do pedido
     */
    async buscar(id) {
        if (!id) {
            throw new Error('ID é obrigatório');
        }

        try {
            console.log('🔍 Buscando pedido:', id);
            const pedido = await ipcRenderer.invoke('pedidos:buscar', id);
            
            if (!pedido) {
                throw new Error('Pedido não encontrado');
            }

            return pedido;
        } catch (error) {
            console.error('❌ Erro ao buscar pedido:', error);
            throw error;
        }
    },

    /**
     * Atualiza um pedido
     * @param {Number} id - ID do pedido
     * @param {Object} dados - Dados para atualizar
     * @returns {Promise<Object>} Resultado da operação
     */
    async atualizar(id, dados) {
        if (!id) {
            throw new Error('ID é obrigatório');
        }

        try {
            console.log('✏️ Atualizando pedido:', id, dados);
            await ipcRenderer.invoke('pedidos:atualizar', id, dados);
            console.log('✅ Pedido atualizado');
            return { success: true };
        } catch (error) {
            console.error('❌ Erro ao atualizar pedido:', error);
            throw new Error('Não foi possível atualizar o pedido');
        }
    },

    /**
     * Deleta um pedido
     * @param {Number} id - ID do pedido
     * @returns {Promise<Object>} Resultado da operação
     */
    async deletar(id) {
        if (!id) {
            throw new Error('ID é obrigatório');
        }

        try {
            console.log('🗑️ Deletando pedido:', id);
            await ipcRenderer.invoke('pedidos:deletar', id);
            console.log('✅ Pedido deletado');
            return { success: true };
        } catch (error) {
            console.error('❌ Erro ao deletar pedido:', error);
            throw new Error('Não foi possível deletar o pedido');
        }
    },

    /**
     * Busca pedidos por texto
     * @param {String} termo - Termo de busca
     * @returns {Promise<Array>} Lista de pedidos encontrados
     */
    async buscarPorTexto(termo) {
        if (!termo || termo.trim() === '') {
            return await this.listar(); // Se vazio, retorna todos
        }

        try {
            console.log('🔍 Buscando por:', termo);
            const pedidos = await ipcRenderer.invoke('pedidos:buscarTexto', termo);
            console.log(`✅ ${pedidos.length} pedidos encontrados`);
            return pedidos;
        } catch (error) {
            console.error('❌ Erro ao buscar pedidos:', error);
            throw new Error('Não foi possível realizar a busca');
        }
    }
};

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PedidosAPI;
}