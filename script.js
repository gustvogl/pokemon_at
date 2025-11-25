// --- Elementos da DOM ---
const cards = document.querySelectorAll('.game-card');
const clockElement = document.getElementById('clock');
const menuItems = document.querySelectorAll('.system-menu-row .sys-icon');
const menuFooterText = document.querySelector('.current-menu-item');
const loadingScreen = document.getElementById('loading-screen');

// --- Controles Físicos ---
const btnA = document.querySelector('.abxy-pad .btn.a');
const btnB = document.querySelector('.abxy-pad .btn.b'); // Selecionando o botão B
const btnLeft = document.querySelector('.d-pad .arrow.left');
const btnRight = document.querySelector('.d-pad .arrow.right');
const homeBtn = document.querySelector('.home-btn'); // Botão Home

// --- Estado do Sistema ---
let currentIndex = 0; 
let currentMenuItemIndex = -1; 

const menuTexts = ["Notícias de Jogos", "eShop", "Álbum", "Controles", "Configurações", "Desligar"];

// --- FUNÇÕES DO SISTEMA ---

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (clockElement) clockElement.innerText = `${hours}:${minutes}`;
}

// Função de Animação Visual do Botão (Afunda quando clica)
function animateButton(buttonElement) {
    buttonElement.style.transform = "translateY(2px)";
    buttonElement.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.8)"; // Sombra interna mais forte
    setTimeout(() => {
        buttonElement.style.transform = "translateY(0)";
        buttonElement.style.boxShadow = ""; // Remove o estilo inline para voltar ao CSS original
    }, 150);
}

// --- FUNÇÕES VISUAIS DE SELEÇÃO ---
function updateGameCardSelection(index) {
    cards.forEach(card => card.classList.remove('active'));
    if (index > -1) {
        cards[index].classList.add('active');
        cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

function updateMenuItemSelection(index) {
    menuItems.forEach(item => item.classList.remove('active'));
    if (index > -1 && index < menuItems.length) {
        menuItems[index].classList.add('active');
        menuFooterText.innerText = menuTexts[index];
    } else if (currentIndex > -1) {
        const activeGame = cards[currentIndex].getAttribute('data-name');
        menuFooterText.innerText = activeGame;
    }
}

// --- AÇÕES DE NAVEGAÇÃO ---

// Ação do Botão A (ENTRAR)
function actionEnter() {
    animateButton(btnA);

    if (currentIndex > -1) {
        // Lógica para entrar no jogo
        const currentCard = cards[currentIndex];
        const targetLink = currentCard.getAttribute('data-link');
        
        loadingScreen.classList.add('visible');
        
        setTimeout(() => {
            if (targetLink && targetLink !== "#") {
                window.location.href = targetLink;
            } else {
                loadingScreen.classList.remove('visible');
                alert("Link não configurado para este card!");
            }
        }, 1500);
        
    } else if (currentMenuItemIndex > -1) {
        // Lógica para entrar no menu
        loadingScreen.classList.add('visible');
        setTimeout(() => {
            loadingScreen.classList.remove('visible');
            alert(`Abrindo Menu: ${menuTexts[currentMenuItemIndex]}`);
        }, 1000);
    }
}

// Ação do Botão B (VOLTAR)
function actionBack() {
    animateButton(btnB);
    
    // Tenta voltar no histórico do navegador
    // Se você estiver na página inicial e não tiver histórico, isso não fará nada visualmente
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Feedback caso não tenha para onde voltar
        console.log("Botão B: Nenhuma página anterior no histórico.");
        // Opcional: alert("Você já está na tela inicial.");
    }
}

// Ação do Botão Home (IR PARA INÍCIO)
function actionHome() {
    animateButton(homeBtn);
    
    loadingScreen.classList.add('visible');
    setTimeout(() => {
        // Redireciona para o index.html (Página Inicial)
        window.location.href = 'index.html';
    }, 500);
}

// Função para mover o cursor (Esquerda/Direita)
function navigateHorizontal(direction) {
    if (currentIndex > -1) { 
        if (direction === 'right' && currentIndex < cards.length - 1) currentIndex++;
        if (direction === 'left' && currentIndex > 0) currentIndex--;
        updateGameCardSelection(currentIndex);
        menuFooterText.innerText = cards[currentIndex].getAttribute('data-name');
    } else if (currentMenuItemIndex > -1) { 
        if (direction === 'right' && currentMenuItemIndex < menuItems.length - 1) currentMenuItemIndex++;
        if (direction === 'left' && currentMenuItemIndex > 0) currentMenuItemIndex--;
        updateMenuItemSelection(currentMenuItemIndex);
    }
}

// --- EVENT LISTENERS (Escuta os cliques e teclas) ---

window.onload = () => {
    updateClock();
    setInterval(updateClock, 1000);
    updateGameCardSelection(currentIndex);
    updateMenuItemSelection(-1);
};

// 1. Cliques na Tela (Botões Físicos)
btnA.addEventListener('click', actionEnter);
btnB.addEventListener('click', actionBack);
homeBtn.addEventListener('click', actionHome);

btnLeft.addEventListener('click', () => navigateHorizontal('left'));
btnRight.addEventListener('click', () => navigateHorizontal('right'));


// 2. Teclado do Computador
document.addEventListener('keydown', (e) => {
    // Setas
    if (e.key === 'ArrowLeft') navigateHorizontal('left');
    if (e.key === 'ArrowRight') navigateHorizontal('right');
    
    // Navegação Vertical (Jogos <-> Menu)
    if (e.key === 'ArrowDown') {
        if (currentIndex > -1) {
            currentIndex = -1;
            currentMenuItemIndex = 0;
            updateGameCardSelection(-1);
            updateMenuItemSelection(currentMenuItemIndex);
        }
    }
    if (e.key === 'ArrowUp') {
        if (currentMenuItemIndex > -1) {
            currentMenuItemIndex = -1;
            currentIndex = 0;
            updateMenuItemSelection(-1);
            updateGameCardSelection(currentIndex);
            menuFooterText.innerText = cards[0].getAttribute('data-name');
        }
    }

    // Ações
    if (e.key === 'Enter') actionEnter(); // Enter = A
    if (e.key === 'Backspace' || e.key === 'Escape') actionBack(); // Backspace/Esc = B
    if (e.key === 'h' || e.key === 'H') actionHome(); // Tecla H = Home
});


// 3. Clique do Mouse nos Cards/Menus
cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        currentIndex = index;
        currentMenuItemIndex = -1;
        updateGameCardSelection(currentIndex);
        updateMenuItemSelection(-1);
        menuFooterText.innerText = card.getAttribute('data-name');
        // Opcional: Se quiser que o clique no card já entre direto, descomente a linha abaixo:
        // actionEnter(); 
    });
});

menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentMenuItemIndex = index;
        currentIndex = -1;
        updateGameCardSelection(-1);
        updateMenuItemSelection(index);
    });
});

// Feedback visual genérico para outros botões
document.querySelectorAll('.btn, .arrow, .capture-btn, .btn-plus, .btn-minus, .stick-top').forEach(btn => {
    // Ignora os que já têm função específica acima para não duplicar animação
    if(btn === btnA || btn === btnB || btn === homeBtn || btn === btnLeft || btn === btnRight) return;
    
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translateY(2px)';
        btn.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.8)';
    });
    btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '';
    });
});