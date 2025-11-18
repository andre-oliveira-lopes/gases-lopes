// ============================================
// UTILS: FORMATTERS - Funções de formatação de dados
// Local: assets/js/utils/formatters.js
// ============================================
/**
 * Formata valor em dinheiro
 * @param {Number} valor - Valor numérico
 * @returns {String} Valor formatado (ex: R$ 5.000,00)
 */
function formatarDinheiro(valor) {
    if (valor === null || valor === undefined) {
        return 'R$ 0,00';
    }
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
/**
 * Formata data para padrão brasileiro
 * @param {String} data - Data no formato YYYY-MM-DD
 * @returns {String} Data formatada (ex: 27/10/2025)
 */
function formatarData(data) {
    if (!data) return '-';
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}
/**
 * Formata data com hora, ajustando para o fuso horário local do usuário.
 * @param {String} dataHora - Data e hora ISO ou formato MySQL (ex: "2025-11-17 22:16:00")
 * @returns {String} Data e hora formatadas (ex: 27/10/2025 às 14:30)
 */
function formatarDataHora(dataHora) {
    if (!dataHora) return '-';

    let dateString = dataHora;

    // Detecta formato MySQL: "YYYY-MM-DD HH:MM:SS" (sem 'T')
    if (typeof dataHora === 'string' && dataHora.includes(' ') && !dataHora.includes('T')) {
        // Ex: "2025-11-17 22:16:00" -> "2025-11-17T22:16:00Z"
        const [dataParte, horaParte] = dataHora.split(' ');
        if (dataParte && horaParte) {
            dateString = `${dataParte}T${horaParte}Z`; // Adiciona 'T' e 'Z' para forçar UTC
        }
    }
    // Detecta formato ISO sem fuso horário: "YYYY-MM-DDTHH:MM:SS"
    else if (typeof dataHora === 'string' && dataHora.includes('T') && !dataHora.endsWith('Z') && !dataHora.includes('+') && !dataHora.includes('-')) {
        // Ex: "2025-11-17T22:16:00" -> "2025-11-17T22:16:00Z"
        dateString = dataHora + 'Z';
    }

    const date = new Date(dateString);

    // Verifica se a data é válida após a criação
    if (isNaN(date.getTime())) {
        return 'Data inválida';
    }

    // Formata para o fuso horário local do usuário (Maranhão)
    const data = date.toLocaleDateString('pt-BR');
    const hora = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `${data} às ${hora}`;
}

/**
 * Formata telefone
 * @param {String} telefone - Telefone (ex: 85999998888)
 * @returns {String} Telefone formatado (ex: (85) 99999-8888)
 */
function formatarTelefone(telefone) {
    if (!telefone) return '-';
    const numero = telefone.replace(/\D/g, '');
    if (numero.length === 11) {
        // Celular: (85) 99999-8888
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
    } else if (numero.length === 10) {
        // Fixo: (85) 3333-4444
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
    }
    return telefone;
}
/**
 * Formata CNPJ
 * @param {String} cnpj - CNPJ (ex: 12345678000190)
 * @returns {String} CNPJ formatado (ex: 12.345.678/0001-90)
 */
function formatarCNPJ(cnpj) {
    if (!cnpj) return '-';
    const numero = cnpj.replace(/\D/g, '');
    if (numero.length === 14) {
        return `${numero.slice(0, 2)}.${numero.slice(2, 5)}.${numero.slice(5, 8)}/${numero.slice(8, 12)}-${numero.slice(12)}`;
    }
    return cnpj;
}
/**
 * Formata status com badge colorido usando classes CSS e emojis.
 * @param {String} status - Status do pedido (Pendente, Concluido, Enviado, Cancelado)
 * @returns {String} HTML com badge colorido e emoji
 */
function formatarStatus(status) {
    let className = '';
    let icon = '';
    let text = '';
    switch (status) {
        case 'Pendente': // Ajustado para corresponder ao valor do select (com 'P' maiúsculo)
            className = 'badge-warning'; // Amarelo para pendente
            icon = '⏳';
            text = 'Pendente';
            break;
        case 'Enviado': // Ajustado para corresponder ao valor do select
            className = 'badge-info'; // Azul para enviado
            icon = '🚀';
            text = 'Enviado';
            break;
        case 'Concluido': // Ajustado para corresponder ao valor do select (com 'C' maiúsculo)
            className = 'badge-success'; // Verde para concluído
            icon = '✅';
            text = 'Concluído';
            break;
        case 'Cancelado': // Ajustado para corresponder ao valor do select (com 'C' maiúsculo)
            className = 'badge-danger'; // Vermelho para cancelado
            icon = '❌';
            text = 'Cancelado';
            break;
        default:
            className = 'badge-secondary'; // Uma classe padrão caso o status não seja reconhecido
            icon = '❓';
            text = status; // Exibe o status original se não for reconhecido
            break;
    }
    // Retorna o HTML com as classes CSS e o emoji
    return `<span class="badge ${className}">${icon} ${text}</span>`;
}

// Exporta todas as funções
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatarDinheiro,
        formatarData,
        formatarDataHora,
        formatarTelefone,
        formatarCNPJ,
        formatarStatus
    };
}
