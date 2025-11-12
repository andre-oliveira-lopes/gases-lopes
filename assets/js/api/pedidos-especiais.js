// ============================================ 
// PEDIDOS API - Funções para o frontend
// Local: assets/js/api/pedidos-especiais.js
// ============================================
const { ipcRenderer } = require('electron');

/**
 * API para gerenciar Pedidos Especiais
 */
const PedidosAPI = {
    /**
     * Lista todos os pedidos
     * @param {Object} filtros - Filtros opcionais (status, termo de busca)
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
            throw new Error('Não foi possível carregar os pedidos. Verifique o console para mais detalhes.');
        }
    },

    /**
     * Cria um novo pedido
     * @param {Object} pedido - Dados do pedido (já validados pelo frontend)
     * @returns {Promise<Object>} Resultado com ID do pedido criado
     */
    async criar(pedido) {
        // A validação completa do pedido será feita no script da página (pedidos-especiais.js)
        // antes de chamar esta função.
        try {
            console.log('➕ Criando pedido...', pedido);
            const result = await ipcRenderer.invoke('pedidos:criar', pedido);
            console.log('✅ Pedido criado com ID:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Erro ao criar pedido:', error);
            throw new Error('Não foi possível criar o pedido. Verifique o console para mais detalhes.');
        }
    },

    /**
     * Busca um pedido por ID
     * @param {Number} id - ID do pedido
     * @returns {Promise<Object>} Dados do pedido
     */
    async buscar(id) {
        if (!id) {
            throw new Error('ID é obrigatório para buscar um pedido.');
        }
        try {
            console.log('🔍 Buscando pedido:', id);
            const pedido = await ipcRenderer.invoke('pedidos:buscar', id);
            if (!pedido) {
                throw new Error('Pedido não encontrado.');
            }
            return pedido;
        } catch (error) {
            console.error('❌ Erro ao buscar pedido:', error);
            throw error; // Re-lança o erro para ser tratado no frontend
        }
    },

    /**
     * Atualiza um pedido
     * @param {Number} id - ID do pedido
     * @param {Object} dados - Dados para atualizar (já validados pelo frontend)
     * @returns {Promise<Object>} Resultado da operação
     */
    async atualizar(id, dados) {
        if (!id) {
            throw new Error('ID é obrigatório para atualizar um pedido.');
        }
        try {
            console.log('✏️ Atualizando pedido:', id, dados);
            // Cria uma cópia dos dados para evitar modificar o objeto original
            const dadosParaAtualizar = { ...dados };

            // Remove campos que não existem mais na nova estrutura da tabela `pedidos_especiais`
            // O frontend deve enviar apenas os campos válidos, mas esta é uma camada de segurança.
            delete dadosParaAtualizar.descricao; // Exemplo de campo antigo
            delete dadosParaAtualizar.quantidade; // Exemplo de campo antigo
            delete dadosParaAtualizar.valor_total_antigo; // Se houver algum campo antigo de valor total
            delete dadosParaAtualizar.status_antigo; // Se houver algum campo antigo de status
            delete dadosParaAtualizar.fornecedor_id; // Conforme já estava

            await ipcRenderer.invoke('pedidos:atualizar', id, dadosParaAtualizar);
            console.log('✅ Pedido atualizado');
            return { success: true };
        } catch (error) {
            console.error('❌ Erro ao atualizar pedido:', error);
            throw new Error('Não foi possível atualizar o pedido. Verifique o console para mais detalhes.');
        }
    },

    /**
     * Deleta um pedido
     * @param {Number} id - ID do pedido
     * @returns {Promise<Object>} Resultado da operação
     */
    async deletar(id) {
        if (!id) {
            throw new Error('ID é obrigatório para deletar um pedido.');
        }
        try {
            console.log('🗑️ Deletando pedido:', id);
            await ipcRenderer.invoke('pedidos:deletar', id);
            console.log('✅ Pedido deletado');
            return { success: true };
        } catch (error) {
            console.error('❌ Erro ao deletar pedido:', error);
            throw new Error('Não foi possível deletar o pedido. Verifique o console para mais detalhes.');
        }
    },

    /**
     * Busca pedidos por texto em campos relevantes (nome_pessoa, cpf, tipo_gas, observacoes)
     * @param {String} termo - Termo de busca
     * @returns {Promise<Array>} Lista de pedidos encontrados
     */
    async buscarPorTexto(termo) {
        if (!termo || termo.trim() === '') {
            return await this.listar(); // Se o termo de busca for vazio, retorna todos os pedidos
        }
        try {
            console.log('🔍 Buscando por:', termo);
            const pedidos = await ipcRenderer.invoke('pedidos:buscarTexto', termo);
            console.log(`✅ ${pedidos.length} pedidos encontrados para o termo "${termo}"`);
            return pedidos;
        } catch (error) {
            console.error('❌ Erro ao buscar pedidos por texto:', error);
            throw new Error('Não foi possível realizar a busca. Verifique o console para mais detalhes.');
        }
    }
};

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PedidosAPI;
}
