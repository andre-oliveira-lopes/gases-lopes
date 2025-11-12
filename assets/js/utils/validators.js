// ============================================
// UTILS: VALIDATORS - Funções de validação de dados
// Local: assets/js/utils/validators.js
// ============================================

/**
 * Valida se campo obrigatório está preenchido
 * @param {String|Number} valor - Valor do campo
 * @returns {Boolean} true se válido, false se inválido
 */
function validarObrigatorio(valor) {
    // Converte para string para garantir que .trim() funcione e verifica se não é nulo/indefinido
    return valor !== null && valor !== undefined && String(valor).trim() !== '';
}

/**
 * Valida email
 * @param {String} email - Email para validar
 * @returns {Boolean} true se válido
 */
function validarEmail(email) {
    if (!validarObrigatorio(email)) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida CPF (algoritmo básico)
 * @param {String} cpf - CPF para validar (pode conter pontos e traços)
 * @returns {Boolean} true se válido
 */
function validarCPF(cpf) {
    if (!validarObrigatorio(cpf)) return false;
    const numero = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (numero.length !== 11 || /^(\d)\1+$/.test(numero)) {
        return false; // CPF deve ter 11 dígitos e não pode ser uma sequência de números iguais
    }

    let soma = 0;
    let resto;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(numero.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(numero.substring(9, 10))) return false;

    soma = 0;
    // Validação do segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(numero.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(numero.substring(10, 11))) return false;

    return true;
}

/**
 * Valida CNPJ (algoritmo básico)
 * @param {String} cnpj - CNPJ para validar (pode conter pontos, barras e traços)
 * @returns {Boolean} true se válido
 */
function validarCNPJ(cnpj) {
    if (!validarObrigatorio(cnpj)) return false;
    const numero = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (numero.length !== 14 || /^(\d)\1+$/.test(numero)) {
        return false; // CNPJ deve ter 14 dígitos e não pode ser uma sequência de números iguais
    }
    // Validação completa de CNPJ é complexa, aqui é uma validação simplificada.
    // Para uma validação robusta, seria necessário implementar o algoritmo de dígitos verificadores.
    return true;
}

/**
 * Valida telefone brasileiro
 * @param {String} telefone - Telefone para validar (pode conter parênteses, espaços e traços)
 * @returns {Boolean} true se válido
 */
function validarTelefone(telefone) {
    if (!validarObrigatorio(telefone)) return false;
    const numero = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
    // Celular (11 dígitos, começando com 9) ou Fixo (10 dígitos)
    return (numero.length === 11 && numero[2] === '9') || (numero.length === 10 && numero[2] !== '9');
}

/**
 * Valida se um valor é um número positivo (maior que zero)
 * @param {String|Number} valor - Valor para validar
 * @returns {Boolean} true se positivo
 */
function validarNumeroPositivo(valor) {
    const numero = parseFloat(String(valor).replace(',', '.')); // Converte para float, tratando vírgula
    return !isNaN(numero) && numero > 0;
}

/**
 * Valida se um valor é um número não negativo (maior ou igual a zero)
 * @param {String|Number} valor - Valor para validar
 * @returns {Boolean} true se não negativo
 */
function validarNumeroNaoNegativo(valor) {
    const numero = parseFloat(String(valor).replace(',', '.')); // Converte para float, tratando vírgula
    return !isNaN(numero) && numero >= 0;
}

/**
 * Valida número inteiro positivo
 * @param {String|Number} valor - Número para validar
 * @returns {Boolean} true se inteiro positivo
 */
function validarInteiroPositivo(valor) {
    const numero = parseInt(String(valor), 10);
    return Number.isInteger(numero) && numero > 0;
}

/**
 * Valida data (não pode ser no passado, ou seja, hoje ou futuro)
 * @param {String} data - Data para validar (YYYY-MM-DD)
 * @returns {Boolean} true se válida (hoje ou futuro)
 */
function validarDataNaoPassada(data) {
    if (!validarObrigatorio(data)) return false;
    const dataInput = new Date(data + 'T00:00:00'); // Garante que a comparação é apenas por data
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
    return dataInput >= hoje;
}

/**
 * Valida se a data de envio é posterior ou igual à data de recebimento
 * @param {String} dataRecebimento - Data de recebimento (YYYY-MM-DD)
 * @param {String} dataEnvio - Data de envio (YYYY-MM-DD)
 * @returns {Boolean} true se válida
 */
function validarDataEnvioAposRecebimento(dataRecebimento, dataEnvio) {
    if (!validarObrigatorio(dataRecebimento) || !validarObrigatorio(dataEnvio)) return true; // Se uma não for obrigatória, não valida a relação
    const rec = new Date(dataRecebimento + 'T00:00:00');
    const env = new Date(dataEnvio + 'T00:00:00');
    return env >= rec;
}

/**
 * Valida se a data de entrega é posterior ou igual à data de envio
 * @param {String} dataEnvio - Data de envio (YYYY-MM-DD)
 * @param {String} dataEntrega - Data de entrega (YYYY-MM-DD)
 * @returns {Boolean} true se válida
 */
function validarDataEntregaAposEnvio(dataEnvio, dataEntrega) {
    if (!validarObrigatorio(dataEnvio) || !validarObrigatorio(dataEntrega)) return true; // Se uma não for obrigatória, não valida a relação
    const env = new Date(dataEnvio + 'T00:00:00');
    const ent = new Date(dataEntrega + 'T00:00:00');
    return ent >= env;
}

/**
 * Valida formulário completo de pedido com a nova estrutura
 * @param {Object} pedido - Dados do pedido
 * @returns {Object} { valido: Boolean, erros: Array }
 */
function validarFormularioPedido(pedido) {
    const erros = [];

    // 1. nome_pessoa (Obrigatório)
    if (!validarObrigatorio(pedido.nome_pessoa)) {
        erros.push('Nome do Cliente é obrigatório.');
    }

    // 2. cpf (Obrigatório e válido)
    if (!validarObrigatorio(pedido.cpf)) {
        erros.push('CPF é obrigatório.');
    } else if (!validarCPF(pedido.cpf)) {
        erros.push('CPF inválido.');
    }

    // 3. tipo_gas (Obrigatório)
    if (!validarObrigatorio(pedido.tipo_gas)) {
        erros.push('Tipo de Gás é obrigatório.');
    }

    // 4. volume_por_kg (Obrigatório)
    if (!validarObrigatorio(pedido.volume_por_kg)) {
        erros.push('Volume/Kg é obrigatório.');
    }

    // 5. valor_recarga (Obrigatório e número positivo)
    if (!validarObrigatorio(pedido.valor_recarga)) {
        erros.push('Valor da Recarga é obrigatório.');
    } else if (!validarNumeroPositivo(pedido.valor_recarga)) {
        erros.push('Valor da Recarga deve ser um número positivo.');
    }

    // 6. desconto (Opcional, mas se preenchido, deve ser número não negativo)
    if (validarObrigatorio(pedido.desconto) && !validarNumeroNaoNegativo(pedido.desconto)) {
        erros.push('Desconto deve ser um número não negativo.');
    }

    // 7. valor_total (Calculado, mas pode ser validado se for enviado)
    // Geralmente não é validado aqui, pois é um campo calculado.

    // 8. data_recebimento (Obrigatório e não pode ser no passado)
    if (!validarObrigatorio(pedido.data_recebimento)) {
        erros.push('Data de Recebimento é obrigatória.');
    } else if (!validarDataNaoPassada(pedido.data_recebimento)) {
        erros.push('Data de Recebimento não pode ser no passado.');
    }

    // 9. data_envio (Opcional, mas se preenchido, deve ser após ou igual à data de recebimento)
    if (validarObrigatorio(pedido.data_envio)) {
        if (!validarDataEnvioAposRecebimento(pedido.data_recebimento, pedido.data_envio)) {
            erros.push('Data de Envio deve ser posterior ou igual à Data de Recebimento.');
        }
    }

    // 10. data_entrega (Opcional, mas se preenchido, deve ser após ou igual à data de envio)
    if (validarObrigatorio(pedido.data_entrega)) {
        if (validarObrigatorio(pedido.data_envio) && !validarDataEntregaAposEnvio(pedido.data_envio, pedido.data_entrega)) {
            erros.push('Data de Entrega deve ser posterior ou igual à Data de Envio.');
        } else if (!validarObrigatorio(pedido.data_envio) && !validarDataNaoPassada(pedido.data_entrega)) {
            // Se data_envio não foi preenchida, data_entrega deve ser pelo menos hoje
            erros.push('Data de Entrega não pode ser no passado.');
        }
    }

    // 11. status_pagamento (Obrigatório)
    if (!validarObrigatorio(pedido.status_pagamento)) {
        erros.push('Status do Pagamento é obrigatório.');
    }

    // 12. observacoes (Opcional, não precisa de validação específica além de obrigatório se fosse o caso)

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
        validarCPF, // <-- ADICIONADO
        validarCNPJ,
        validarTelefone,
        validarNumeroPositivo,
        validarNumeroNaoNegativo, // <-- ADICIONADO
        validarInteiroPositivo,
        validarDataNaoPassada, // <-- RENOMEADO
        validarDataEnvioAposRecebimento, // <-- ADICIONADO
        validarDataEntregaAposEnvio, // <-- ADICIONADO
        validarFormularioPedido
    };
}
