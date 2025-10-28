// ============================================
// NAVIGATION - Sistema de navegação
// Local: assets/js/navigation.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Marca o item ativo no menu baseado na URL atual
    highlightActiveMenuItem();

    // Adiciona evento ao botão de sair
    setupExitButton();

    // Adiciona suavização na navegação (opcional)
    setupSmoothNavigation();
});

/**
 * Marca o item do menu que corresponde à página atual
 */
function highlightActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.sidebar__menu-item');

    menuItems.forEach(item => {
        const link = item.querySelector('.sidebar__link');
        if (link) {
            const href = link.getAttribute('href');
            const linkPage = href.split('/').pop();

            // Remove classe ativa de todos
            item.classList.remove('sidebar__menu-item--active');

            // Adiciona classe ativa ao item correspondente
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && linkPage === 'index.html')) {
                item.classList.add('sidebar__menu-item--active');
            }
        }
    });
}

/**
 * Configura o botão de sair
 */
function setupExitButton() {
    const exitBtn = document.querySelector('.topbar__exit-btn');
    
    if (exitBtn) {
        exitBtn.addEventListener('click', async () => {
            if (confirm('Deseja realmente sair?')) {
                try {
                    const { ipcRenderer } = require('electron');
                    await ipcRenderer.invoke('app:fechar');
                } catch (error) {
                    console.error('Erro ao sair:', error);
                    window.close();
                }
            }
        });
    }
}

/**
 * Adiciona efeito de loading durante navegação (opcional)
 */
function setupSmoothNavigation() {
    const links = document.querySelectorAll('.sidebar__link, .quick-card');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Adiciona classe de loading se quiser
            // document.body.classList.add('is-loading');
        });
    });
}

/**
 * Função helper para navegação programática
 * Use: navigateTo('pages/pedidos-especiais.html')
 */
function navigateTo(page) {
    window.location.href = page;
}

// Exporta funções para uso global (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateTo,
        highlightActiveMenuItem
    };
}
