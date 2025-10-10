// ============================================
// TOPBAR - Funcionalidades da barra superior
// Local: assets/js/topbar.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const settingsBody = document.getElementById('settingsBody');
    const menuItems = document.querySelectorAll('.settings-modal__menu-item');

    // Toggle do dropdown do usuário
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Fecha o dropdown ao clicar fora
        document.addEventListener('click', () => {
            userDropdown.classList.remove('active');
        });

        // Previne fechar ao clicar dentro do dropdown
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Função para carregar conteúdo das páginas de configuração
    async function loadConfigPage(pageName) {
        try {
            settingsBody.innerHTML = '<div class="settings-loading"><p>Carregando...</p></div>';
            
            const response = await fetch(`pages_config/${pageName}-content.html`);
            
            if (!response.ok) {
                throw new Error('Página não encontrada');
            }
            
            const content = await response.text();
            settingsBody.innerHTML = content;
            
            // Atualiza o item ativo no menu
            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === pageName) {
                    item.classList.add('active');
                }
            });
            
        } catch (error) {
            settingsBody.innerHTML = `
                <div class="settings-error">
                    <h2>Erro ao carregar</h2>
                    <p>Não foi possível carregar esta página de configurações.</p>
                </div>
            `;
        }
    }

    // Abre o modal de configurações
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            // Carrega a primeira página (aparência) por padrão
            loadConfigPage('aparencia');
        });
    }

    // Fecha o modal de configurações
    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });

        // Fecha ao clicar fora do conteúdo
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });
    }

    // Navegação entre as páginas de configuração
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.getAttribute('data-page');
            loadConfigPage(pageName);
        });
    });
});