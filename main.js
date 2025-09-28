// Importa os módulos principais do Electron
const { app, BrowserWindow } = require("electron");

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
    width: 800, // Largura inicial da janela
    height: 600, // Altura inicial da janela
    minWidth: 400, // Largura mínima da janela
    minHeight: 300, // Altura mínima da janela
    webPreferences: {
      nodeIntegration: true, // Permite uso do Node.js no frontend
    },
    title: "My Electron App", // Título da janela
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
}

// Cria a janela quando o app estiver pronto
app.whenReady().then(createWindow);

// Encerra o app quando todas as janelas forem fechadas (exceto no macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
