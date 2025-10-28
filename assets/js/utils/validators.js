// assets/js/utils/validators.js

/**
 * Valida se campo obrigatório está preenchido
 * @param {String} valor - Valor do campo
 * @returns {Boolean} true se válido, false se inválido
 */
function validarObrigatorio(valor) {
    return valor !== null && valor !== undefined && valor.toString().trim() !== '';
}

/**
 * Valida email
 * @param {String} email - Email para validar
 * @returns {Boolean} true se válido
 */
function validarEmail(email) {
    if (!email) return false;
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida CNPJ
 * @param {String} cnpj - CNPJ para validar
 * @returns {Boolean} true se válido
 */
function validarCNPJ(cnpj) {
    if (!cnpj) return false;
    
    const numero = cnpj.replace(/\D/g, '');
    
    if (numero.length !== 14) return false;
    
    // Validação simplificada (você pode melhorar com algoritmo completo)
    if (/^(\d)\1+$/.test(numero)) return false; // Rejeita sequências iguais
    
    return true;
}

/**
 * Valida telefone brasileiro
 * @param {String} telefone - Telefone para validar
 * @returns {Boolean} true se válido
 */
function validarTelefone(telefone) {
    if (!telefone) return false;
    
    const numero = telefone.replace(/\D/g, '');
    
    // Celular (11 dígitos) ou Fixo (10 dígitos)
    return numero.length === 10 || numero.length === 11;
}

/**
 * Valida número positivo
 * @param {Number} numero - Número para validar
 * @returns {Boolean} true se positivo
 */
function validarNumeroPositivo(numero) {
    return numero !== null && numero !== undefined && numero > 0;
}

/**
 * Valida número inteiro positivo
 * @param {Number} numero - Número para validar
 * @returns {Boolean} true se inteiro positivo
 */
function validarInteiroPositivo(numero) {
    return Number.isInteger(numero) && numero > 0;
}

/**
 * Valida data (não pode ser no passado)
 * @param {String} data - Data para validar (YYYY-MM-DD)
 * @returns {Boolean} true se válida
 */
function validarDataFutura(data) {
    if (!data) return false;
    
    const dataInput = new Date(data + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return dataInput >= hoje;
}

/**
 * Valida formulário completo de pedido
 * @param {Object} pedido - Dados do pedido
 * @returns {Object} { valido: Boolean, erros: Array }
 */
function validarFormularioPedido(pedido) {
    const erros = [];
    
    if (!validarObrigatorio(pedido.descricao)) {
        erros.push('Descrição é obrigatória');
    }
    
    if (!validarInteiroPositivo(pedido.quantidade)) {
        erros.push('Quantidade deve ser um número inteiro positivo');
    }
    
    if (pedido.valor_total && !validarNumeroPositivo(pedido.valor_total)) {
        erros.push('Valor total deve ser positivo');
    }
    
    if (pedido.data_entrega && !validarDataFutura(pedido.data_entrega)) {
        erros.push('Data de entrega não pode ser no passado');
    }
    
    return {
        valido: erros.length === 0,
        erros: erros
    };
}

// Exporta todas as funções
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarObrigatorio,
        validarEmail,
        validarCNPJ,
        validarTelefone,
        validarNumeroPositivo,
        validarInteiroPositivo,
        validarDataFutura,
        validarFormularioPedido
    };
}