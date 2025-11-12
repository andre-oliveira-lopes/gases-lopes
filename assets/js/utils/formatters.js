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
 * Formata data com hora
 * @param {String} dataHora - Data e hora ISO
 * @returns {String} Data e hora formatadas (ex: 27/10/2025 às 14:30)
 */
function formatarDataHora(dataHora) {
    if (!dataHora) return '-';
    const date = new Date(dataHora);
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
 * Formata status com badge colorido usando classes CSS.
 * @param {String} status - Status (pendente, aprovado, entregue, cancelado)
 * @returns {String} HTML com badge colorido
 */
function formatarStatus(status) {
    let className = '';
    let icon = '';
    let text = '';

    switch (status) {
        case 'pendente':
            className = 'badge-warning';
            icon = '⏳';
            text = 'Pendente';
            break;
        case 'aprovado':
            className = 'badge-info'; // Usando info para aprovado, como no seu SCSS
            icon = '✅';
            text = 'Aprovado';
            break;
        case 'entregue':
            className = 'badge-success';
            icon = '📦';
            text = 'Entregue';
            break;
        case 'cancelado':
            className = 'badge-danger';
            icon = '❌';
            text = 'Cancelado';
            break;
        default:
            className = 'badge-secondary'; // Uma classe padrão caso o status não seja reconhecido
            icon = '❓';
            text = status;
            break;
    }
    // Retorna o HTML com as classes CSS, sem estilos inline
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
