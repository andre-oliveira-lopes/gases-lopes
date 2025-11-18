// ============================================
// PEDIDOS ESPECIAIS - Lógica da página
// Local: assets/js/pages/pedidos-especiais-page.js
// ============================================

// Importa as dependências
const { ipcRenderer } = require('electron');

// Importa os módulos usando caminhos relativos à pasta 'pages/'
const PedidosAPI = require('../assets/js/api/pedidos-especiais.js'); // Caminho CORRIGIDO
const { validarFormularioPedido } = require('../assets/js/utils/validators.js'); // Caminho CORRIGIDO
const { formatarDinheiro, formatarData, formatarStatus, formatarDataHora } = require('../assets/js/utils/formatters.js'); // Caminho CORRIGIDO

// ============================================
// Elementos do DOM
const pedidosContainer = document.getElementById('pedidosContainer');
const pedidoModal = document.getElementById('pedidoModal');
const confirmDeleteModal = document.getElementById('confirmDeleteModal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const newPedidoBtn = document.getElementById('newPedidoBtn');
const closePedidoModalButtons = document.querySelectorAll('#pedidoModal .close-btn'); // Seleciona todos os botões de fechar no modal de pedido
const savePedidoBtn = document.getElementById('savePedidoBtn');
const closeConfirmDeleteButtons = document.querySelectorAll('#confirmDeleteModal .close-btn'); // Seleciona todos os botões de fechar no modal de confirmação
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Variáveis globais
let pedidoEditando = null; // ID do pedido sendo editado (null = novo pedido)
let pedidoParaDeletar = null; // ID do pedido para deletar

// ============================================
// LISTAS DE OPÇÕES PARA OS SELECTS DO MODAL
// ============================================

// Opções para o Método de Pagamento (coluna status_pagamento)
const METODOS_PAGAMENTO = [
    { value: 'Nenhum', text: 'Nenhum' },
    { value: 'Pix', text: 'Pix' },
    { value: 'Dinheiro', text: 'Dinheiro' },
    { value: 'Transferencia Bancaria', text: 'Transferência Bancária' },
    { value: 'Cartao de Credito', text: 'Cartão de Crédito' },
    { value: 'Cartao de Debito', text: 'Cartão de Débito' },
    { value: 'Boleto Bancario', text: 'Boleto Bancário' },
    { value: 'Outro', text: 'Outro' }
];

// Opções para o Status do Pedido (coluna status)
const STATUS_PEDIDO = [
    { value: 'Pendente', text: 'Pendente' },
    { value: 'Concluido', text: 'Concluído' },
    { value: 'Enviado', text: 'Enviado' },
    { value: 'Cancelado', text: 'Cancelado' }
];

// Função auxiliar para popular um elemento <select>
// Esta função será usada para preencher os selects do modal
function popularSelect(selectElement, options, selectedValue = '') {
    selectElement.innerHTML = ''; // Limpa as opções existentes
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        if (option.value === selectedValue) {
            opt.selected = true;
        }
        selectElement.appendChild(opt);
    });
}


// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Configura os event listeners
    setupEventListeners();

    // Carrega os pedidos iniciais
    await carregarPedidos();
});

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Botão "Novo Pedido"
    if (newPedidoBtn) {
        newPedidoBtn.addEventListener('click', abrirModalNovoPedido);
    }

    // Botão "Buscar"
    if (searchBtn) {
        searchBtn.addEventListener('click', buscarPedidos);
    }

    // Enter no campo de busca
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarPedidos();
            }
        });
    }

    // Botão "Salvar Pedido"
    if (savePedidoBtn) {
        savePedidoBtn.addEventListener('click', salvarPedido);
    }

    // Botões "Fechar Modal Pedido"
    closePedidoModalButtons.forEach(button => {
        button.addEventListener('click', fecharModalPedido);
    });

    // Clique fora do modal para fechar
    if (pedidoModal) {
        pedidoModal.addEventListener('click', (e) => {
            if (e.target === pedidoModal) {
                fecharModalPedido();
            }
        });
    }

    // Botões "Cancelar Exclusão"
    closeConfirmDeleteButtons.forEach(button => {
        button.addEventListener('click', fecharModalConfirmacao);
    });

    // Clique fora do modal de confirmação para fechar
    if (confirmDeleteModal) {
        confirmDeleteModal.addEventListener('click', (e) => {
            if (e.target === confirmDeleteModal) {
                fecharModalConfirmacao();
            }
        });
    }

    // Botão "Confirmar Exclusão"
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deletarPedidoConfirmado);
    }

    // Adicionar listeners para cálculo automático do valor total
    const valorRecargaInput = document.getElementById('valorRecarga');
    const descontoInput = document.getElementById('desconto');
    const valorTotalInput = document.getElementById('valorTotal');

    if (valorRecargaInput && descontoInput && valorTotalInput) {
        const calcularValorTotal = () => {
            const valorRecarga = parseFloat(valorRecargaInput.value.replace(',', '.')) || 0;
            const desconto = parseFloat(descontoInput.value.replace(',', '.')) || 0;
            const total = valorRecarga - desconto;
            valorTotalInput.value = formatarDinheiro(total).replace('R$ ', ''); // Remove R$ para preencher o input
        };
        valorRecargaInput.addEventListener('input', calcularValorTotal);
        descontoInput.addEventListener('input', calcularValorTotal);
    }
}

// ============================================
// FUNÇÕES DE CARREGAMENTO E BUSCA
// ============================================
async function carregarPedidos(filtros = {}) {
    try {
        console.log('📋 Carregando pedidos...', filtros);
        const pedidos = await PedidosAPI.listar(filtros);
        console.log(`✅ ${pedidos.length} pedidos carregados`);
        renderizarPedidos(pedidos);
    } catch (error) {
        console.error('❌ Erro ao carregar pedidos:', error);
        mostrarMensagemErro('Não foi possível carregar os pedidos.');
    }
}

async function buscarPedidos() {
    const termo = searchInput.value.trim();
    try {
        if (termo === '') {
            await carregarPedidos(); // Se vazio, carrega todos
        } else {
            console.log('🔍 Buscando pedidos por:', termo);
            const pedidos = await PedidosAPI.buscarPorTexto(termo);
            console.log(`✅ ${pedidos.length} pedidos encontrados para "${termo}"`);
            renderizarPedidos(pedidos);
        }
    } catch (error) {
        console.error('❌ Erro na busca:', error);
        mostrarMensagemErro('Erro ao realizar busca.');
    }
}

// ============================================
// RENDERIZAÇÃO DOS PEDIDOS
// ============================================
function renderizarPedidos(pedidos) {
    if (!pedidosContainer) return;

    if (pedidos.length === 0) {
        pedidosContainer.innerHTML = `
            <div class="no-pedidos-message">
                <h3>Nenhum pedido encontrado</h3>
                <p>Não há pedidos especiais cadastrados no momento.</p>
                <p>Crie o primeiro pedido usando o botão "Novo Pedido" acima.</p>
            </div>
        `;
        return;
    }

    const pedidosHTML = pedidos.map(pedido => criarCardPedido(pedido)).join('');
    pedidosContainer.innerHTML = pedidosHTML;
}

function criarCardPedido(pedido) {
    // Mapeia os campos do banco para exibição
    const nomeCliente = pedido.nome_pessoa || 'Cliente não identificado';

    // Status do pedido (Pendente, Enviado, Concluído, Cancelado...)
    const statusPedido = pedido.status || 'Pendente';
    const statusPedidoFormatado = formatarStatus(statusPedido); // Se formatarStatus pinta badge, mantemos

    // Método de pagamento (Pix, Dinheiro, Transferência ...)
    const metodoPagamento = pedido.status_pagamento || 'Nenhum';
    const metodoPagamentoFormatado = metodoPagamento; // Se quiser depois podemos criar um formatador também

    const valorFormatado = formatarDinheiro(pedido.valor_total || 0);
    const dataRecebimento = formatarData(pedido.data_recebimento);
    const tipoGas = pedido.tipo_gas || 'Não especificado';
    // Lógica para truncar as observações (já implementada)
    let observacoesParaExibir = '';
    if (pedido.observacoes) {
        const limiteCaracteres = 30;
        if (pedido.observacoes.length > limiteCaracteres) {
            observacoesParaExibir = pedido.observacoes.substring(0, limiteCaracteres) + '...';
        } else {
            observacoesParaExibir = pedido.observacoes;
        }
    }
    // NOVAS VARIÁVEIS: Data de Envio e Data de Entrega
    // Usamos '?' para verificar se a data existe antes de formatar, caso contrário, exibe 'Não informada'.
    const dataEnvio = pedido.data_envio ? formatarData(pedido.data_envio) : 'Não informada';
    const dataEntrega = pedido.data_entrega ? formatarData(pedido.data_entrega) : 'Não informada';

    return `
        <div class="pedido-card" data-pedido-id="${pedido.id}">
            <h3>${nomeCliente}</h3>
            <div class="card-info">
                <p><strong>CPF:</strong> ${pedido.cpf || 'Não informado'}</p>
                <p><strong>Tipo de Gás:</strong> ${tipoGas}</p>
                <p><strong>Quantidade:</strong> ${pedido.quantidade || 0} unidades</p>
                <p><strong>Volume/Kg:</strong> ${pedido.volume_por_kg || 0} kg</p>
                <p><strong>Valor Total:</strong> ${valorFormatado}</p>
                <p><strong>Data Recebimento:</strong> ${dataRecebimento}</p>

                <!-- NOVOS CAMPOS: Data de Envio e Data de Entrega -->
                <p><strong>Data de Envio:</strong> ${dataEnvio}</p>
                <p><strong>Data de Entrega:</strong> ${dataEntrega}</p>

                <p><strong>Status do Pedido:</strong> ${statusPedidoFormatado}</p>
                <p><strong>Método de Pagamento:</strong> ${metodoPagamentoFormatado}</p>


                ${observacoesParaExibir ? `<p><strong>Observações:</strong> ${observacoesParaExibir}</p>` : ''}
            </div>
            <div class="card-timestamp">
                <p>Criado em: ${formatarDataHora(pedido.created_at)}</p>
                ${pedido.updated_at ? `<p>Atualizado em: ${formatarDataHora(pedido.updated_at)}</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="abrirModalEditar(${pedido.id})">
                    <span>✏️</span> Editar
                </button>
                <button class="btn btn-danger" onclick="abrirConfirmacaoExclusao(${pedido.id})">
                    <span>🗑️</span> Excluir
                </button>
            </div>
        </div>
    `;
}

// ============================================
// MODAL DE NOVO/EDITAR PEDIDO
// ============================================
function abrirModalNovoPedido() {
    pedidoEditando = null; // Novo pedido
    limparFormulario(); // Esta função já limpa e define alguns padrões

    // NOVO CÓDIGO: Popular os selects com as opções padrão
    const metodoPagamentoSelect = document.getElementById('metodoPagamento');
    const statusPedidoSelect = document.getElementById('statusPedido');

    popularSelect(metodoPagamentoSelect, METODOS_PAGAMENTO, 'Nenhum'); // Padrão: Nenhum
    popularSelect(statusPedidoSelect, STATUS_PEDIDO, 'Pendente'); // Padrão: Pendente

    if (pedidoModal) {
        pedidoModal.classList.add('show');
    }
    if (savePedidoBtn) {
        savePedidoBtn.textContent = 'Criar Pedido';
    }
    document.getElementById('modalTitle').textContent = 'Criar Novo Pedido Especial'; // Atualiza o título do modal
}

async function abrirModalEditar(id) {
    try {
        console.log('✏️ Carregando pedido para edição:', id);
        const pedido = await PedidosAPI.buscar(id);

        if (!pedido) {
            mostrarMensagemErro('Pedido não encontrado.');
            return;
        }
        // Preenche o formulário com os dados do pedido
        document.getElementById('pedidoId').value = pedido.id;
        document.getElementById('nomePessoa').value = pedido.nome_pessoa || '';
        document.getElementById('cpf').value = pedido.cpf || '';
        document.getElementById('tipoGas').value = pedido.tipo_gas || '';
        document.getElementById('quantidade').value = pedido.quantidade || '';
        document.getElementById('volumePorKg').value = pedido.volume_por_kg || '';
        document.getElementById('valorRecarga').value = pedido.valor_recarga || '';
        document.getElementById('desconto').value = pedido.desconto || '0.00';
        document.getElementById('valorTotal').value = pedido.valor_total || '';
        document.getElementById('dataRecebimento').value = pedido.data_recebimento || '';
        document.getElementById('dataEnvio').value = pedido.data_envio || '';
        document.getElementById('dataEntrega').value = pedido.data_entrega || '';
        const metodoPagamentoSelect = document.getElementById('metodoPagamento');
        const statusPedidoSelect = document.getElementById('statusPedido');
        popularSelect(metodoPagamentoSelect, METODOS_PAGAMENTO, pedido.status_pagamento || 'Nenhum');
        popularSelect(statusPedidoSelect, STATUS_PEDIDO, pedido.status || 'Pendente');
        document.getElementById('observacoes').value = pedido.observacoes || '';

        pedidoEditando = id;
        if (pedidoModal) {
            pedidoModal.classList.add('show');
        }
        if (savePedidoBtn) {
            savePedidoBtn.textContent = 'Atualizar Pedido';
        }
        document.getElementById('modalTitle').textContent = `Editar Pedido #${pedido.id}`; // Atualiza o título do modal

    } catch (error) {
        console.error('❌ Erro ao carregar pedido:', error);
        mostrarMensagemErro('Erro ao carregar dados do pedido.');
    }
}

function limparFormulario() {
    const form = pedidoModal.querySelector('form');
    if (form) {
        form.reset(); // Isso limpa a maioria dos campos do formulário
    }
    // Define valores padrão para campos específicos que não são resetados automaticamente
    // ou que precisam de um valor inicial específico.

    // REMOVEMOS A LINHA ANTIGA: document.getElementById('statusPagamento').value = 'Pendente';
    // Pois agora os selects são populados e têm seus padrões definidos em 'abrirModalNovoPedido'
    // usando a função 'popularSelect'.

    document.getElementById('desconto').value = '0.00';
    document.getElementById('valorTotal').value = '0.00'; // Garante que o total seja resetado
    // Se você tiver outros campos que precisam de um valor padrão após o reset, adicione-os aqui.
}


function fecharModalPedido() {
    if (pedidoModal) {
        pedidoModal.classList.remove('show');
    }
    limparFormulario();
    pedidoEditando = null;
}

// ============================================
// SALVAR PEDIDO (CRIAR OU ATUALIZAR)
// ============================================
async function salvarPedido(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Coleta os dados do formulário
    const pedidoData = {
        nome_pessoa: document.getElementById('nomePessoa').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        tipo_gas: document.getElementById('tipoGas').value,
        quantidade: parseInt(document.getElementById('quantidade').value) || 0,
        volume_por_kg: parseFloat(document.getElementById('volumePorKg').value.replace(',', '.')) || 0, // Lida com vírgula para decimais
        valor_recarga: parseFloat(document.getElementById('valorRecarga').value.replace(',', '.')) || 0, // Lida com vírgula para decimais
        desconto: parseFloat(document.getElementById('desconto').value.replace(',', '.')) || 0, // Lida com vírgula para decimais
        valor_total: parseFloat(document.getElementById('valorTotal').value.replace(',', '.')) || 0, // Lida com vírgula para decimais
        data_recebimento: document.getElementById('dataRecebimento').value,
        data_envio: document.getElementById('dataEnvio').value,
        data_entrega: document.getElementById('dataEntrega').value,
        status_pagamento: document.getElementById('metodoPagamento').value,
        status: document.getElementById('statusPedido').value,
        observacoes: document.getElementById('observacoes').value.trim()
    };

    // Valida os dados
    const validacao = validarFormularioPedido(pedidoData);
    if (!validacao.valido) {
        mostrarMensagemErro('Por favor, corrija os seguintes erros:<br>' + validacao.erros.join('<br>'));
        return;
    }

    try {
        if (pedidoEditando) {
            // Atualizar pedido existente
            console.log('✏️ Atualizando pedido:', pedidoEditando);
            await PedidosAPI.atualizar(pedidoEditando, pedidoData);
            mostrarMensagemSucesso('Pedido atualizado com sucesso!');
        } else {
            // Criar novo pedido
            console.log('➕ Criando novo pedido');
            await PedidosAPI.criar(pedidoData);
            mostrarMensagemSucesso('Pedido criado com sucesso!');
        }

        // Fecha o modal e recarrega a lista
        fecharModalPedido();
        await carregarPedidos();

    } catch (error) {
        console.error('❌ Erro ao salvar pedido:', error);
        mostrarMensagemErro('Erro ao salvar pedido. Verifique os dados e tente novamente.');
    }
}

// ============================================
// MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
// ============================================
function abrirConfirmacaoExclusao(id) {
    pedidoParaDeletar = id;
    if (confirmDeleteModal) {
        confirmDeleteModal.classList.add('show');
    }
}

function fecharModalConfirmacao() {
    if (confirmDeleteModal) {
        confirmDeleteModal.classList.remove('show');
    }
    pedidoParaDeletar = null;
}

async function deletarPedidoConfirmado() {
    if (!pedidoParaDeletar) return;

    try {
        console.log('🗑️ Confirmando exclusão do pedido:', pedidoParaDeletar);
        await PedidosAPI.deletar(pedidoParaDeletar);
        mostrarMensagemSucesso('Pedido excluído com sucesso!');

        // Fecha o modal e recarrega a lista
        fecharModalConfirmacao();
        await carregarPedidos();

    } catch (error) {
        console.error('❌ Erro ao deletar pedido:', error);
        mostrarMensagemErro('Erro ao excluir pedido. Tente novamente.');
    }
}

// ============================================
// FUNÇÕES DE MENSAGENS
// ============================================
function mostrarMensagemSucesso(mensagem) {
    // Cria um elemento de notificação temporária
    const notificacao = document.createElement('div');
    notificacao.className = 'notification success';
    notificacao.innerHTML = `
        <span>✅</span> ${mensagem}
    `;
    notificacao.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #d4edda; color: #155724; 
        padding: 15px 20px; border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999; font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notificacao);

    // Remove após 4 segundos
    setTimeout(() => {
        notificacao.remove();
    }, 4000);
}

function mostrarMensagemErro(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notification error';
    notificacao.innerHTML = `
        <span>❌</span> ${mensagem}
    `;
    notificacao.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #f8d7da; color: #721c24; 
        padding: 15px 20px; border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999; font-weight: 500;
        max-width: 400px; line-height: 1.4;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notificacao);

    // Remove após 6 segundos
    setTimeout(() => {
        notificacao.remove();
    }, 6000);
}

// ============================================
// FUNÇÕES GLOBAIS (para os botões nos cards)
// ============================================
// Essas funções precisam estar no escopo global para funcionar nos onclick dos cards
window.abrirModalEditar = abrirModalEditar;
window.abrirConfirmacaoExclusao = abrirConfirmacaoExclusao;

// ============================================
// CSS para animações das notificações (adicione no <head> ou em um arquivo CSS)
// ============================================
// Esta parte pode ser movida para um arquivo CSS se preferir
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .notification { 
        display: flex; align-items: center; gap: 10px; 
    }
`;
document.head.appendChild(style);
