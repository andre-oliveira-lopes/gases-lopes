// ============================================
// MAIN.JS - Arquivo principal do Electron
// Atualizado com integração do SQLite
// ============================================

// Para ver a versão do Node que o Electron carrega
console.log('--- Verificacao de Versao ---');
console.log('Versao do Node.js executando este processo:', process.version);
console.log('NODE_MODULE_VERSION do processo:', process.versions.modules);

// Importa os módulos principais do Electron
const { app, BrowserWindow, ipcMain } = require("electron");

// ============================================
// INICIALIZAÇÃO DO BANCO DE DADOS
// ============================================
// Inicializa o banco de dados e cria as tabelas
require('./database/migrations/init');

// Importa os models
const pedidosModel = require('./database/models/pedidos');
const fornecedoresModel = require('./database/models/fornecedores');

// ============================================
// CONFIGURAÇÃO DA JANELA
// ============================================

// Variável que irá armazenar a janela principal
let mainWindow;

// Prevenir múltiplas instâncias do app
const gotTheLock = app.requestSingleInstanceLock();
// Se não conseguir o bloqueio, encerra o app
if (!gotTheLock) {
  app.quit();
  return;
}

// Se o usuário tentar abrir outra instância, foca na janela existente
app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Função responsável por criar a janela principal do app
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1340, // Largura inicial da janela
    height: 870, // Altura inicial da janela
    minWidth: 800, // Largura mínima da janela
    minHeight: 600, // Altura mínima da janela
    webPreferences: {
      nodeIntegration: true, // Permite uso do Node.js no frontend
      contextIsolation: false, // ← ADICIONADO: necessário para IPC funcionar
      enableRemoteModule: true // ← ADICIONADO: habilita módulo remote
    },
    title: "Gases União App", // Título da janela
    autoHideMenuBar: true, // Oculta a barra de menu
    icon: __dirname + "/assets/oxygen.ico", // Ícone da aplicação
    show: false, // Janela começa oculta
  });
  
  // Carrega o arquivo HTML principal
  mainWindow.loadFile("index.html");
  
  // Mostra a janela apenas quando estiver pronta para exibir
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // ← OPCIONAL: Abre DevTools automaticamente em desenvolvimento
  // mainWindow.webContents.openDevTools();
}

// ============================================
// IPC HANDLERS - Comunicação com o Frontend
// ============================================

// -------- PEDIDOS ESPECIAIS --------

// Listar pedidos (com filtros opcionais)
ipcMain.handle('pedidos:listar', async (event, filtros) => {
  try {
    const pedidos = pedidosModel.listarPedidos(filtros || {});
    console.log(`📋 Listados ${pedidos.length} pedidos`);
    return pedidos;
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    throw error;
  }
});

// Criar novo pedido
ipcMain.handle('pedidos:criar', async (event, pedido) => {
  try {
    const id = pedidosModel.criarPedido(pedido);
    console.log(`✅ Pedido criado com ID: ${id}`);
    return { success: true, id };
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    throw error;
  }
});

// Buscar pedido por ID
ipcMain.handle('pedidos:buscar', async (event, id) => {
  try {
    const pedido = pedidosModel.buscarPedidoPorId(id);
    console.log(`🔍 Pedido encontrado: ${pedido ? pedido.descricao : 'Não encontrado'}`);
    return pedido;
  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    throw error;
  }
});

// Atualizar pedido
ipcMain.handle('pedidos:atualizar', async (event, id, dados) => {
  try {
    pedidosModel.atualizarPedido(id, dados);
    console.log(`✏️ Pedido ${id} atualizado`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar pedido:', error);
    throw error;
  }
});

// Deletar pedido
ipcMain.handle('pedidos:deletar', async (event, id) => {
  try {
    pedidosModel.deletarPedido(id);
    console.log(`🗑️ Pedido ${id} deletado`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao deletar pedido:', error);
    throw error;
  }
});

// Buscar pedidos por texto
ipcMain.handle('pedidos:buscarTexto', async (event, termo) => {
  try {
    const pedidos = pedidosModel.buscarPedidos(termo);
    console.log(`🔍 Encontrados ${pedidos.length} pedidos com "${termo}"`);
    return pedidos;
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    throw error;
  }
});

// -------- FORNECEDORES --------

// Listar todos os fornecedores
ipcMain.handle('fornecedores:listar', async () => {
  try {
    const fornecedores = fornecedoresModel.listarFornecedores();
    console.log(`📋 Listados ${fornecedores.length} fornecedores`);
    return fornecedores;
  } catch (error) {
    console.error('❌ Erro ao listar fornecedores:', error);
    throw error;
  }
});

// Criar novo fornecedor
ipcMain.handle('fornecedores:criar', async (event, fornecedor) => {
  try {
    const id = fornecedoresModel.criarFornecedor(fornecedor);
    console.log(`✅ Fornecedor criado com ID: ${id}`);
    return { success: true, id };
  } catch (error) {
    console.error('❌ Erro ao criar fornecedor:', error);
    throw error;
  }
});

// Buscar fornecedor por ID
ipcMain.handle('fornecedores:buscar', async (event, id) => {
  try {
    const fornecedor = fornecedoresModel.buscarFornecedorPorId(id);
    console.log(`🔍 Fornecedor encontrado: ${fornecedor ? fornecedor.nome : 'Não encontrado'}`);
    return fornecedor;
  } catch (error) {
    console.error('❌ Erro ao buscar fornecedor:', error);
    throw error;
  }
});

// Atualizar fornecedor
ipcMain.handle('fornecedores:atualizar', async (event, id, dados) => {
  try {
    fornecedoresModel.atualizarFornecedor(id, dados);
    console.log(`✏️ Fornecedor ${id} atualizado`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar fornecedor:', error);
    throw error;
  }
});

// Deletar fornecedor
ipcMain.handle('fornecedores:deletar', async (event, id) => {
  try {
    fornecedoresModel.deletarFornecedor(id);
    console.log(`🗑️ Fornecedor ${id} deletado`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao deletar fornecedor:', error);
    throw error;
  }
});

// Buscar fornecedores por texto
ipcMain.handle('fornecedores:buscarTexto', async (event, termo) => {
  try {
    const fornecedores = fornecedoresModel.buscarFornecedores(termo);
    console.log(`🔍 Encontrados ${fornecedores.length} fornecedores com "${termo}"`);
    return fornecedores;
  } catch (error) {
    console.error('❌ Erro ao buscar fornecedores:', error);
    throw error;
  }
});

// -------- FECHAR JANELA --------
ipcMain.handle('app:fechar', () => {
  app.quit();
});

// ============================================
// LIFECYCLE DO APP
// ============================================

// Cria a janela quando o app estiver pronto
app.whenReady().then(() => {
  createWindow();
  console.log('🚀 App iniciado com sucesso!');
});

// Encerra o app quando todas as janelas forem fechadas (exceto no macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// No macOS, recria a janela quando o ícone do dock for clicado
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});