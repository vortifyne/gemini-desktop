const state = {
    apiKey: null,
    activeChatId: null,
    chats: [],
    pinnedChatIds: JSON.parse(localStorage.getItem('pinnedChatIds') || '[]'),
    chatTags: JSON.parse(localStorage.getItem('chatTags') || '{}'),
    currentTagChatId: null,
    searchQuery: '',
    drafts: {},
    isSending: false,
    isAborted: false,
    wasLastAborted: false,
    isMockMode: false,
    currentLoaderId: null,
    charBlurTimer: null,
    uiScale: parseInt(localStorage.getItem('uiScale') || '100'),
};

const mockResponses = [
    `Да, я полностью согласен с твоим подходом! Это наиболее эффективное техническое решение. Чем я могу помочь еще?`,

    `Отличный вопрос! Вот пример конкурентной обработки каналов на **Go** с использованием горутин:\n\n\`\`\`go\npackage main\n\nimport (\n\t"fmt"\n\t"time"\n)\n\nfunc worker(id int, jobs <-chan int, results chan<- int) {\n\tfor j := range jobs {\n\t\tfmt.Printf("Worker %d started job %d\\n", id, j)\n\t\ttime.Sleep(time.Millisecond * 500)\n\t\tresults <- j * 2\n\t}\n}\n\nfunc main() {\n\tjobs := make(chan int, 100)\n\tresults := make(chan int, 100)\n\n\tfor w := 1; w <= 3; w++ {\n\t\tgo worker(w, jobs, results)\n\t}\n\n\tfor j := 1; j <= 5; j++ {\n\t\tjobs <- j\n\t}\n\tclose(jobs)\n\n\tfor a := 1; a <= 5; a++ {\n\t\t<-results\n\t}\n}\n\`\`\``,

    `## Архитектурный разбор системы\n\nПроектирование современных клиент-серверных приложений требует соблюдения нескольких ключевых принципов:\n\n1. **Изоляция слоев (Clean Architecture):** Доменная логика не должна зависеть от фреймворков и БД.\n2. **Асинхронность и конкурентность:** Использование фоновых воркеров для тяжелых вычислений.\n3. **Кэширование и персистентность:** Сохранение состояния на клиенте и сервере.\n\n> "Хороший код — это не тот, который легко написать, а тот, который легко поддерживать и масштабировать."\n\n* **Плюсы:** Высокий FPS, низкое потребление памяти.\n* **Минусы:** Требуется повышенный контроль за состоянием приложения.`,

    `Вот готовый пример верстки карточки профиля на **HTML & JavaScript**:\n\n\`\`\`javascript\nclass UserCard extends HTMLElement {\n  constructor() {\n    super();\n    this.attachShadow({ mode: 'open' });\n  }\n\n  connectedCallback() {\n    const name = this.getAttribute('name') || 'Гость';\n    this.shadowRoot.innerHTML = \\\`\n      <style>\n        .card { padding: 1rem; border-radius: 12px; background: #18181b; color: #fff; }\n      </style>\n      <div class="card">\n        <h3>Привет, \\\${name}!</h3>\n      </div>\n    \\\`;\n  }\n}\n\ncustomElements.define('user-card', UserCard);\n\`\`\``,

    `Ниже приведено сравнение популярных ИИ моделей для разработчиков:\n\n| Модель | Скорость | Качество кода | Окно контекста |\n| :--- | :---: | :---: | :---: |\n| **Gemini Pro** | Высокая | Отличное | 1M токенов |\n| **GPT-4o** | Средняя | Превосходное | 128k токенов |\n| **Claude 3.5** | Высокая | Выдающееся | 200k токенов |\n\nОсновные рекомендации:\n* Используйте **Gemini** для больших документов и быстрого прототипирования.\n* Используйте **Claude** для глубокого рефакторинга сложного кода.`
];

const AppAPI = {
    getChats: async () => {
        if (window.go?.bindings?.App?.GetChats) {
            return await window.go.bindings.App.GetChats();
        }
        console.warn('[Wails] Running in mock mode for GetChats');
        return [];
    },
    createChat: async (title) => {
        if (window.go?.bindings?.App?.CreateChat) {
            return await window.go.bindings.App.CreateChat(title);
        }
        console.warn('[Wails] Running in mock mode for CreateChat');
        return Date.now();
    },
    getMessages: async (chatId) => {
        if (window.go?.bindings?.App?.GetMessages) {
            return await window.go.bindings.App.GetMessages(chatId);
        }
        console.warn('[Wails] Running in mock mode for GetMessages');
        return [];
    },
    sendMessageToAI: async (chatId, text) => {
        if (state.isMockMode) {
            await new Promise((res) => setTimeout(res, 1000));
            const randomIndex = Math.floor(Math.random() * mockResponses.length);
            return mockResponses[randomIndex];
        }
        if (window.go?.bindings?.App?.SendMessageToAI) {
            return await window.go.bindings.App.SendMessageToAI(chatId, text);
        }
        console.warn('[Wails] Running in mock mode for SendMessageToAI');
        await new Promise((res) => setTimeout(res, 1500));
        return `Это тестовый ответ от **ИИ** (без Go-бэкенда).\n\nВот тебе пример кода:\n\`\`\`js\nconsole.log("Hello, Wails!");\n\`\`\``;
    },
    validateApiKey: async (key) => {
        if (window.go?.bindings?.App?.SetApiKey) {
            return await window.go.bindings.App.SetApiKey(key);
        }
        console.warn('[Wails] Running in mock mode');
        return key && key.trim().length >= 5;
    }
};

const DOM = {
    authScreen: document.getElementById('auth-screen'),
    chatScreen: document.getElementById('chat-screen'),
    authForm: document.getElementById('auth-form'),
    apiKeyInput: document.getElementById('api-key-input'),
    btnLogin: document.getElementById('btn-login'),

    sidebar: document.getElementById('sidebar'),
    btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
    mockModeToggle: document.getElementById('mock-mode-toggle'),
    netStatus: document.getElementById('net-status'),
    netStatusText: document.getElementById('net-status-text'),
    searchChatInput: document.getElementById('search-chat-input'),
    chatList: document.getElementById('chat-list'),
    btnNewChat: document.getElementById('btn-new-chat'),
    btnLogout: document.getElementById('btn-logout'),
    currentChatTitle: document.getElementById('current-chat-title'),
    btnExportChat: document.getElementById('btn-export-chat'),

    btnZoomDec: document.getElementById('btn-zoom-dec'),
    btnZoomInc: document.getElementById('btn-zoom-inc'),
    zoomVal: document.getElementById('zoom-val'),

    exportModal: document.getElementById('export-modal'),
    btnCloseExportModal: document.getElementById('btn-close-export-modal'),
    btnExportMd: document.getElementById('btn-export-md'),
    btnExportJson: document.getElementById('btn-export-json'),

    tagModal: document.getElementById('tag-modal'),
    btnCloseTagModal: document.getElementById('btn-close-tag-modal'),
    customTagForm: document.getElementById('custom-tag-form'),
    tagColorInput: document.getElementById('tag-color-input'),
    tagNameInput: document.getElementById('tag-name-input'),
    btnSaveTag: document.getElementById('btn-save-tag'),
    btnRemoveTag: document.getElementById('btn-remove-tag'),

    messagesContainer: document.getElementById('messages-container'),
    btnScrollBottom: document.getElementById('btn-scroll-bottom'),
    emptyState: document.getElementById('empty-state'),
    messageForm: document.getElementById('message-form'),
    messageInput: document.getElementById('message-input'),
    charCounter: document.getElementById('char-counter'),
    btnSend: document.getElementById('btn-send'),

    fmtBold: document.getElementById('fmt-bold'),
    fmtItalic: document.getElementById('fmt-italic'),
    fmtCode: document.getElementById('fmt-code'),
    fmtList: document.getElementById('fmt-list'),

    toast: document.getElementById('toast'),
    toastBox: document.getElementById('toast-box'),
    toastIconInfo: document.getElementById('toast-icon-info'),
    toastIconError: document.getElementById('toast-icon-error'),
    toastMessage: document.getElementById('toast-message'),
};

marked.setOptions({
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (e) {
                console.error('Highlight error:', e);
            }
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
});

let toastTimer = null;
function showToast(message, type = 'info', duration = 5000) {
    DOM.toastMessage.textContent = message;

    if (type === 'error') {
        DOM.toastBox.className = 'flex items-center gap-3 bg-rose-950 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-xl shadow-2xl';
        DOM.toastIconError.classList.remove('hidden');
        DOM.toastIconInfo.classList.add('hidden');
    } else {
        DOM.toastBox.className = 'flex items-center gap-3 bg-zinc-900 border border-zinc-700/80 text-zinc-200 px-4 py-3 rounded-xl shadow-2xl';
        DOM.toastIconInfo.classList.remove('hidden');
        DOM.toastIconError.classList.add('hidden');
    }

    DOM.toast.classList.remove('translate-y-20', 'opacity-0');
    DOM.toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        DOM.toast.classList.remove('translate-y-0', 'opacity-100');
        DOM.toast.classList.add('translate-y-20', 'opacity-0');
    }, duration);
}

function formatMessageTime(dateStr) {
    if (!dateStr) {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCharWord(count) {
    const lastTwo = count % 100;
    if (lastTwo >= 11 && lastTwo <= 19) return 'символов';
    const last = count % 10;
    if (last === 1) return 'символ';
    if (last >= 2 && last <= 4) return 'символа';
    return 'символов';
}

function getChatDateGroup(dateStr) {
    if (!dateStr) return 'Ранее';
    const chatDate = new Date(dateStr);
    if (isNaN(chatDate.getTime())) return 'Ранее';

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const past7DaysStart = new Date(todayStart);
    past7DaysStart.setDate(past7DaysStart.getDate() - 7);

    if (chatDate >= todayStart) return 'Сегодня';
    if (chatDate >= yesterdayStart) return 'Вчера';
    if (chatDate >= past7DaysStart) return 'Прошлые 7 дней';
    return 'Ранее';
}

function applyUiScale() {
    document.body.style.zoom = `${state.uiScale}%`;
    DOM.zoomVal.textContent = `${state.uiScale}%`;
    localStorage.setItem('uiScale', state.uiScale);
}

function applyFormatting(before, after = '') {
    const input = DOM.messageInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    const selected = val.substring(start, end);

    const replacement = before + selected + after;
    input.value = val.substring(0, start) + replacement + val.substring(end);

    input.focus();
    if (selected.length > 0) {
        input.setSelectionRange(start, start + replacement.length);
    } else {
        input.setSelectionRange(start + before.length, start + before.length);
    }

    input.dispatchEvent(new Event('input'));
}

function updateNetStatus() {
    if (navigator.onLine) {
        DOM.netStatus.className = 'flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full';
        DOM.netStatusText.textContent = 'Онлайн';
    } else {
        DOM.netStatus.className = 'flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full';
        DOM.netStatusText.textContent = 'Офлайн';
        showToast('Интернет-соединение потеряно!', 'error');
    }
}
window.addEventListener('online', updateNetStatus);
window.addEventListener('offline', updateNetStatus);

window.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;

    if (e.key === 'Escape') {
        DOM.exportModal.classList.add('hidden');
        DOM.tagModal.classList.add('hidden');
        if (document.activeElement) {
            document.activeElement.blur();
        }
        return;
    }

    if (!isCmdOrCtrl) return;

    const key = e.key.toLowerCase();

    if (key === 'n') {
        e.preventDefault();
        createNewChat();
    } else if (key === 'f') {
        e.preventDefault();
        if (DOM.sidebar.classList.contains('collapsed')) {
            DOM.sidebar.classList.remove('collapsed');
        }
        DOM.searchChatInput.focus();
        DOM.searchChatInput.select();
    } else if (e.key === '\\') {
        e.preventDefault();
        DOM.sidebar.classList.toggle('collapsed');
    } else if (key === 'm') {
        e.preventDefault();
        DOM.mockModeToggle.checked = !DOM.mockModeToggle.checked;
        DOM.mockModeToggle.dispatchEvent(new Event('change'));
    } else if (key === 'e') {
        e.preventDefault();
        DOM.btnExportChat.click();
    }
});

DOM.btnZoomDec.addEventListener('click', () => {
    if (state.uiScale > 50) {
        state.uiScale -= 10;
        applyUiScale();
    }
});

DOM.btnZoomInc.addEventListener('click', () => {
    if (state.uiScale < 200) {
        state.uiScale += 10;
        applyUiScale();
    }
});

DOM.fmtBold.addEventListener('click', () => applyFormatting('**', '**'));
DOM.fmtItalic.addEventListener('click', () => applyFormatting('*', '*'));
DOM.fmtCode.addEventListener('click', () => applyFormatting('`', '`'));
DOM.fmtList.addEventListener('click', () => applyFormatting('- '));

DOM.btnToggleSidebar.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('collapsed');
});

DOM.mockModeToggle.addEventListener('change', (e) => {
    state.isMockMode = e.target.checked;
    if (state.isMockMode) {
        showToast('Mock Mode включен: запросы в API Gemini не отправляются', 'info');
    } else {
        showToast('Mock Mode отключен: работаем через Gemini API', 'info');
    }
});

DOM.searchChatInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    renderChatList();
});

DOM.messagesContainer.addEventListener('scroll', () => {
    const distanceToBottom = DOM.messagesContainer.scrollHeight - DOM.messagesContainer.scrollTop - DOM.messagesContainer.clientHeight;
    if (distanceToBottom > 200) {
        DOM.btnScrollBottom.classList.remove('hidden');
    } else {
        DOM.btnScrollBottom.classList.add('hidden');
    }
});

DOM.btnScrollBottom.addEventListener('click', () => {
    scrollToBottom(true);
});

DOM.btnExportChat.addEventListener('click', () => {
    if (!state.activeChatId) {
        showToast('Выберите чат для экспорта', 'error');
        return;
    }
    DOM.exportModal.classList.remove('hidden');
});

DOM.btnCloseExportModal.addEventListener('click', () => {
    DOM.exportModal.classList.add('hidden');
});

DOM.exportModal.addEventListener('click', (e) => {
    if (e.target === DOM.exportModal) {
        DOM.exportModal.classList.add('hidden');
    }
});

function openTagModal(chatId) {
    state.currentTagChatId = chatId;
    const existing = state.chatTags[chatId];
    if (existing) {
        DOM.tagNameInput.value = existing.name || '';
        DOM.tagColorInput.value = existing.color || '#a855f7';
    } else {
        DOM.tagNameInput.value = '';
        DOM.tagColorInput.value = '#a855f7';
    }
    DOM.tagModal.classList.remove('hidden');
}

DOM.btnCloseTagModal.addEventListener('click', () => {
    DOM.tagModal.classList.add('hidden');
});

DOM.tagModal.addEventListener('click', (e) => {
    if (e.target === DOM.tagModal) {
        DOM.tagModal.classList.add('hidden');
    }
});

DOM.customTagForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.currentTagChatId) return;
    const name = DOM.tagNameInput.value.trim();
    const color = DOM.tagColorInput.value;

    state.chatTags[state.currentTagChatId] = { name, color };
    localStorage.setItem('chatTags', JSON.stringify(state.chatTags));
    renderChatList();
    DOM.tagModal.classList.add('hidden');
});

DOM.btnRemoveTag.addEventListener('click', () => {
    if (!state.currentTagChatId) return;
    delete state.chatTags[state.currentTagChatId];
    localStorage.setItem('chatTags', JSON.stringify(state.chatTags));
    renderChatList();
    DOM.tagModal.classList.add('hidden');
});

document.querySelectorAll('.btn-tag-preset').forEach(btn => {
    btn.onclick = () => {
        if (!state.currentTagChatId) return;
        const name = btn.dataset.presetName;
        const color = btn.dataset.presetColor;
        state.chatTags[state.currentTagChatId] = { name, color };
        localStorage.setItem('chatTags', JSON.stringify(state.chatTags));
        renderChatList();
        DOM.tagModal.classList.add('hidden');
    };
});

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

DOM.btnExportMd.addEventListener('click', async () => {
    if (!state.activeChatId) return;
    const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
    const title = currentChat ? (currentChat.title || currentChat.Title || 'Чат') : 'Чат';
    const messages = await AppAPI.getMessages(state.activeChatId);

    let md = `# ${title}\n\n`;
    messages.forEach(msg => {
        const role = (msg.role || msg.Role) === 'user' ? 'YOU' : 'AI';
        const time = formatMessageTime(msg.created_at || msg.CreatedAt);
        const text = msg.content || msg.Content || '';
        md += `### **${role}** _(${time})_\n${text}\n\n---\n\n`;
    });

    const safeTitle = title.replace(/[^a-zA-Z0-9а-яА-Я_-]/g, '_');
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(md, `chat_${safeTitle}_${date}.md`, 'text/markdown;charset=utf-8');
    DOM.exportModal.classList.add('hidden');
    showToast('Чат экспортирован в Markdown', 'info');
});

DOM.btnExportJson.addEventListener('click', async () => {
    if (!state.activeChatId) return;
    const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
    const title = currentChat ? (currentChat.title || currentChat.Title || 'Чат') : 'Чат';
    const messages = await AppAPI.getMessages(state.activeChatId);

    const exportData = {
        title,
        exportedAt: new Date().toISOString(),
        messages: messages.map(msg => ({
            role: msg.role || msg.Role,
            content: msg.content || msg.Content,
            createdAt: msg.created_at || msg.CreatedAt
        }))
    };

    const json = JSON.stringify(exportData, null, 2);
    const safeTitle = title.replace(/[^a-zA-Z0-9а-яА-Я_-]/g, '_');
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(json, `chat_${safeTitle}_${date}.json`, 'application/json;charset=utf-8');
    DOM.exportModal.classList.add('hidden');
    showToast('Чат экспортирован в JSON', 'info');
});

function updateSendButtonUI() {
    if (state.isSending) {
        DOM.btnSend.disabled = false;
        DOM.btnSend.className = 'p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all duration-150 shrink-0 shadow-md';
        DOM.btnSend.innerHTML = `
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
      </svg>
    `;
        DOM.btnSend.title = 'Остановить генерацию';
    } else {
        DOM.btnSend.className = 'p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all duration-150 shrink-0 shadow-md';
        DOM.btnSend.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9-7-9-7-9 7 9 7zm0 0v-8"/>
      </svg>
    `;
        DOM.btnSend.title = 'Отправить';
        DOM.btnSend.disabled = !DOM.messageInput.value.trim();
    }
}

DOM.authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = DOM.apiKeyInput.value.trim();

    DOM.btnLogin.disabled = true;
    DOM.btnLogin.classList.add('opacity-75');
    DOM.btnLogin.innerHTML = `<span>Проверка...</span>`;

    try {
        const isValid = await AppAPI.validateApiKey(key);

        if (isValid) {
            state.apiKey = key;
            DOM.authScreen.classList.add('hidden');
            DOM.chatScreen.classList.remove('hidden');
            await initChatApp();
        } else {
            showToast('Неверный API ключ! Проверь и повтори попытку.', 'error');
        }
    } catch (err) {
        showToast('Ошибка при валидации ключа', 'error');
        console.error(err);
    } finally {
        DOM.btnLogin.disabled = false;
        DOM.btnLogin.classList.remove('opacity-75');
        DOM.btnLogin.innerHTML = `<span>Войти в систему</span>`;
    }
});

DOM.btnLogout.addEventListener('click', () => {
    state.apiKey = null;
    state.activeChatId = null;
    state.chats = [];
    state.drafts = {};
    DOM.chatScreen.classList.add('hidden');
    DOM.authScreen.classList.remove('hidden');
    DOM.apiKeyInput.value = '';
    DOM.messageInput.value = '';
});

async function initChatApp() {
    try {
        applyUiScale();

        const chats = await AppAPI.getChats();
        state.chats = chats || [];
        renderChatList();

        if (state.chats.length > 0) {
            const firstId = state.chats[0].id || state.chats[0].ID;
            await selectChat(firstId);
        } else {
            state.activeChatId = null;
            DOM.currentChatTitle.textContent = 'Выберите или создайте чат';
            DOM.messagesContainer.innerHTML = '';
            DOM.messagesContainer.appendChild(DOM.emptyState);
        }
    } catch (err) {
        showToast('Ошибка загрузки истории чатов', 'error');
        console.error(err);
        state.chats = [];
        state.activeChatId = null;
        renderChatList();
        DOM.currentChatTitle.textContent = 'Выберите или создайте чат';
        DOM.messagesContainer.innerHTML = '';
        DOM.messagesContainer.appendChild(DOM.emptyState);
    }
}

async function createNewChat(title = 'Новый чат') {
    if (DOM.btnNewChat.disabled) return;
    DOM.btnNewChat.disabled = true;
    DOM.btnNewChat.classList.add('opacity-50', 'pointer-events-none');

    try {
        const chatId = await AppAPI.createChat(title);
        const newChat = { id: chatId, title: `${title} #${state.chats.length + 1}`, created_at: new Date().toISOString() };
        state.chats.unshift(newChat);
        renderChatList();
        await selectChat(chatId);
    } catch (err) {
        showToast('Не удалось создать чат', 'error');
        console.error(err);
    } finally {
        DOM.btnNewChat.disabled = false;
        DOM.btnNewChat.classList.remove('opacity-50', 'pointer-events-none');
    }
}

function togglePinChat(chatId, e) {
    if (e) e.stopPropagation();
    const index = state.pinnedChatIds.indexOf(chatId);
    if (index > -1) {
        state.pinnedChatIds.splice(index, 1);
    } else {
        state.pinnedChatIds.push(chatId);
    }
    localStorage.setItem('pinnedChatIds', JSON.stringify(state.pinnedChatIds));
    renderChatList();
}

function renderChatList() {
    DOM.chatList.innerHTML = '';

    let list = [...state.chats];

    if (state.searchQuery) {
        list = list.filter(chat => {
            const title = (chat.title || chat.Title || '').toLowerCase();
            return title.includes(state.searchQuery);
        });
    }

    const pinned = [];
    const unpinned = [];

    list.forEach(chat => {
        const id = chat.id || chat.ID;
        if (state.pinnedChatIds.includes(id)) {
            pinned.push(chat);
        } else {
            unpinned.push(chat);
        }
    });

    const renderChatGroup = (chatArray, groupTitle = null) => {
        if (chatArray.length === 0) return;

        if (groupTitle) {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'text-[10px] uppercase font-bold text-zinc-500 px-3 pt-3 pb-1 select-none';
            headerDiv.textContent = groupTitle;
            DOM.chatList.appendChild(headerDiv);
        }

        chatArray.forEach((chat) => {
            const id = chat.id || chat.ID;
            const title = chat.title || chat.Title || 'Без названия';
            const tagObj = state.chatTags[id];
            const isActive = id === state.activeChatId;
            const isPinned = state.pinnedChatIds.includes(id);

            const btn = document.createElement('button');
            btn.className = `w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${
                isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`;

            btn.innerHTML = `
        <div class="flex items-center gap-2 truncate max-w-[170px]">
          ${tagObj ? `<span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${tagObj.color};" title="${tagObj.name || ''}"></span>` : ''}
          ${isPinned ? `<svg class="w-3.5 h-3.5 text-indigo-400 shrink-0 rotate-45" fill="currentColor" viewBox="0 0 24 24"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>` : ''}
          <span class="truncate">${title}</span>
        </div>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button class="btn-tag p-1 text-zinc-500 hover:text-indigo-400 rounded transition-colors" title="Метка">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5a1 1 0 01.707.293l7 7a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 013 12V7a4 4 0 014-4z"/></svg>
          </button>
          <button class="btn-pin p-1 text-zinc-500 hover:text-indigo-400 rounded transition-colors" title="${isPinned ? 'Открепить' : 'Закрепить'}">
            <svg class="w-3.5 h-3.5 ${isPinned ? 'rotate-45 text-indigo-400' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </button>
        </div>
      `;

            btn.onclick = () => selectChat(id);
            btn.oncontextmenu = (e) => {
                e.preventDefault();
                openTagModal(id);
            };

            const tagBtn = btn.querySelector('.btn-tag');
            if (tagBtn) {
                tagBtn.onclick = (e) => {
                    e.stopPropagation();
                    openTagModal(id);
                };
            }

            const pinBtn = btn.querySelector('.btn-pin');
            if (pinBtn) {
                pinBtn.onclick = (e) => togglePinChat(id, e);
            }

            DOM.chatList.appendChild(btn);
        });
    };

    if (pinned.length > 0) {
        renderChatGroup(pinned, 'Закрепленные');
    }

    const groups = {
        'Сегодня': [],
        'Вчера': [],
        'Прошлые 7 дней': [],
        'Ранее': []
    };

    unpinned.forEach(chat => {
        const dateStr = chat.created_at || chat.CreatedAt;
        const grp = getChatDateGroup(dateStr);
        groups[grp].push(chat);
    });

    ['Сегодня', 'Вчера', 'Прошлые 7 дней', 'Ранее'].forEach(grpName => {
        if (groups[grpName].length > 0) {
            renderChatGroup(groups[grpName], grpName);
        }
    });
}

async function selectChat(chatId) {
    if (state.activeChatId && state.activeChatId !== chatId) {
        state.drafts[state.activeChatId] = DOM.messageInput.value;
    }

    state.activeChatId = chatId;
    const currentChat = state.chats.find(c => (c.id || c.ID) === chatId);
    if (currentChat) {
        DOM.currentChatTitle.textContent = currentChat.title || currentChat.Title || 'Без названия';
    }

    renderChatList();

    DOM.messageInput.value = state.drafts[chatId] || '';
    DOM.messageInput.style.height = 'auto';
    if (DOM.messageInput.value) {
        DOM.messageInput.style.height = `${Math.min(DOM.messageInput.scrollHeight, 192)}px`;
    }
    DOM.btnSend.disabled = !DOM.messageInput.value.trim() || state.isSending;

    const len = DOM.messageInput.value.length;
    DOM.charCounter.textContent = `${len} ${getCharWord(len)}`;

    await loadMessages(chatId);
}

async function loadMessages(chatId) {
    DOM.messagesContainer.innerHTML = '';

    try {
        const messages = await AppAPI.getMessages(chatId);

        if (!messages || messages.length === 0) {
            DOM.messagesContainer.appendChild(DOM.emptyState);
            return;
        }

        messages.forEach(msg => appendMessageUI(
            msg.role || msg.Role,
            msg.content || msg.Content,
            msg.created_at || msg.CreatedAt,
            msg.duration || msg.Duration || null,
            false
        ));
        scrollToBottom(false);
    } catch (err) {
        showToast('Ошибка загрузки сообщений', 'error');
        console.error(err);
    }
}

function processCodeBlocks(container) {
    const pres = container.querySelectorAll('pre');
    pres.forEach((pre) => {
        const code = pre.querySelector('code');
        if (code && !code.dataset.highlighted) {
            try {
                hljs.highlightElement(code);
            } catch (e) {
                console.error('Highlight error:', e);
            }
            code.dataset.highlighted = 'true';
        }

        if (pre.dataset.hasHeader) return;
        pre.dataset.hasHeader = 'true';

        if (!code) return;

        let lang = 'code';
        code.classList.forEach((cls) => {
            if (cls.startsWith('language-')) {
                lang = cls.replace('language-', '');
            }
        });

        const rawCodeText = code.innerText || code.textContent;

        const lines = rawCodeText.split('\n');
        if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
        const lineNumsHtml = lines.map((_, i) => `<div>${i + 1}</div>`).join('');

        const codeWrapper = document.createElement('div');
        codeWrapper.className = 'flex overflow-x-auto p-4 font-mono text-xs leading-relaxed';

        const lineNumsDiv = document.createElement('div');
        lineNumsDiv.className = 'select-none pr-3 border-r border-zinc-800/80 text-zinc-600 text-right shrink-0 font-mono';
        lineNumsDiv.innerHTML = lineNumsHtml;

        const codeContentDiv = document.createElement('div');
        codeContentDiv.className = 'pl-3 flex-1 overflow-x-auto';
        codeContentDiv.appendChild(code.cloneNode(true));

        const rawTextArea = document.createElement('textarea');
        rawTextArea.className = 'w-full h-48 bg-zinc-950 text-zinc-300 font-mono text-xs p-3 focus:outline-none resize-y hidden';
        rawTextArea.value = rawCodeText;
        rawTextArea.readOnly = true;

        codeWrapper.appendChild(lineNumsDiv);
        codeWrapper.appendChild(codeContentDiv);

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-mono select-none';
        header.innerHTML = `
      <span>${lang}</span>
      <div class="flex items-center gap-3">
        <button class="btn-toggle-raw hover:text-zinc-100 transition-colors">Raw</button>
        <button class="btn-copy-code flex items-center gap-1.5 hover:text-zinc-100 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z"/></svg>
          <span>Скопировать код</span>
        </button>
      </div>
    `;

        const copyBtn = header.querySelector('.btn-copy-code');
        const copyText = copyBtn.querySelector('span');
        const toggleRawBtn = header.querySelector('.btn-toggle-raw');

        let isRaw = false;

        toggleRawBtn.onclick = () => {
            isRaw = !isRaw;
            if (isRaw) {
                codeWrapper.classList.add('hidden');
                rawTextArea.classList.remove('hidden');
                toggleRawBtn.textContent = 'Code';
                toggleRawBtn.classList.add('text-indigo-400');
            } else {
                codeWrapper.classList.remove('hidden');
                rawTextArea.classList.add('hidden');
                toggleRawBtn.textContent = 'Raw';
                toggleRawBtn.classList.remove('text-indigo-400');
            }
        };

        copyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(rawCodeText);
                copyText.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyText.textContent = 'Скопировать код';
                }, 2000);
            } catch (err) {
                console.error('Copy error:', err);
            }
        };

        pre.innerHTML = '';
        pre.appendChild(header);
        pre.appendChild(codeWrapper);
        pre.appendChild(rawTextArea);
    });
}

function appendMessageUI(role, content, createdAt, duration = null, isAborted = false) {
    if (DOM.messagesContainer.contains(DOM.emptyState)) {
        DOM.messagesContainer.removeChild(DOM.emptyState);
    }

    const isUser = role === 'user';
    const timeStr = formatMessageTime(createdAt);
    const wrapper = document.createElement('div');
    wrapper.className = `flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`;

    const htmlContent = marked.parse(content);

    wrapper.innerHTML = `
    <div class="flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
        isUser ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-indigo-400 border border-zinc-700/50'
    }">
        ${isUser ? 'YOU' : 'AI'}
      </div>

      <div class="flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}">
        <div class="px-4 py-3 rounded-2xl select-text relative group transition-all duration-200 border ${
        isUser
            ? 'bg-indigo-600 border-transparent hover:border-zinc-300/80 text-white rounded-tr-none markdown-body markdown-user shadow-sm'
            : 'bg-zinc-900 border-zinc-800/80 hover:border-indigo-500/40 text-zinc-200 rounded-tl-none markdown-body shadow-sm'
    }">
          ${htmlContent}
          <div class="flex items-center justify-between gap-3 text-[10px] ${isUser ? 'text-indigo-200' : 'text-zinc-500'} mt-1.5 select-none font-mono leading-none">
            ${(!isUser && duration) ? `<span class="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 font-medium">⚡ ${duration}</span>` : '<span></span>'}
            <span>${timeStr}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn-copy-msg flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors px-1 py-0.5 rounded">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z"/></svg>
            <span>Скопировать текст</span>
          </button>
          ${(!isUser && isAborted) ? `
            <button class="btn-continue-ai flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors px-1 py-0.5 rounded">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
              <span>Продолжить генерацию...</span>
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

    const copyMsgBtn = wrapper.querySelector('.btn-copy-msg');
    if (copyMsgBtn) {
        const copyMsgSpan = copyMsgBtn.querySelector('span');
        copyMsgBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(content);
                copyMsgSpan.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyMsgSpan.textContent = 'Скопировать текст';
                }, 2000);
            } catch (err) {
                console.error('Copy message error:', err);
            }
        };
    }

    const continueBtn = wrapper.querySelector('.btn-continue-ai');
    if (continueBtn) {
        continueBtn.onclick = () => {
            DOM.messageInput.value = 'Продолжи с того места, где остановился';
            DOM.messageInput.dispatchEvent(new Event('input'));
            handleSendMessage();
        };
    }

    const msgBubble = wrapper.querySelector('.markdown-body');
    if (msgBubble) {
        processCodeBlocks(msgBubble);
    }

    DOM.messagesContainer.appendChild(wrapper);
    scrollToBottom(true);
}

function appendLoaderUI() {
    const loaderId = `loader-${Date.now()}`;
    const wrapper = document.createElement('div');
    wrapper.id = loaderId;
    wrapper.className = 'flex gap-4 justify-start animate-fade-in';

    wrapper.innerHTML = `
    <div class="flex gap-3 max-w-3xl flex-row">
      <div class="w-8 h-8 rounded-xl bg-zinc-800 text-indigo-400 border border-zinc-700/50 flex items-center justify-center shrink-0 text-xs font-bold">
        AI
      </div>
      <div class="px-4 py-3 rounded-2xl rounded-tl-none bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1.5">
        <div class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-fast"></div>
        <div class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-fast [animation-delay:0.2s]"></div>
        <div class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-fast [animation-delay:0.4s]"></div>
      </div>
    </div>
  `;

    DOM.messagesContainer.appendChild(wrapper);
    scrollToBottom(true);
    return loaderId;
}

function removeLoaderUI(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) loader.remove();
}

function scrollToBottom(smooth = true) {
    DOM.messagesContainer.scrollTo({
        top: DOM.messagesContainer.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

DOM.btnNewChat.addEventListener('click', () => createNewChat());

DOM.messageInput.addEventListener('input', () => {
    DOM.messageInput.style.height = 'auto';
    DOM.messageInput.style.height = `${Math.min(DOM.messageInput.scrollHeight, 192)}px`;
    if (!state.isSending) {
        DOM.btnSend.disabled = !DOM.messageInput.value.trim();
    }

    const len = DOM.messageInput.value.length;
    DOM.charCounter.classList.add('blur-[1px]', 'opacity-50');
    DOM.charCounter.textContent = `${len} ${getCharWord(len)}`;

    if (state.charBlurTimer) clearTimeout(state.charBlurTimer);
    state.charBlurTimer = setTimeout(() => {
        DOM.charCounter.classList.remove('blur-[1px]', 'opacity-50');
    }, 150);
});

DOM.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!DOM.btnSend.disabled) {
            handleSendMessage();
        }
    }
});

DOM.messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!DOM.btnSend.disabled) {
        handleSendMessage();
    }
});

async function handleSendMessage() {
    if (state.isSending) {
        state.isAborted = true;
        state.wasLastAborted = true;
        state.isSending = false;
        if (state.currentLoaderId) {
            removeLoaderUI(state.currentLoaderId);
            state.currentLoaderId = null;
        }
        updateSendButtonUI();
        showToast('Генерация остановлена', 'info');
        return;
    }

    const text = DOM.messageInput.value.trim();
    if (!text || !state.activeChatId) return;

    delete state.drafts[state.activeChatId];
    DOM.messageInput.value = '';
    DOM.messageInput.style.height = 'auto';

    DOM.charCounter.textContent = '0 символов';

    state.isSending = true;
    state.isAborted = false;
    state.wasLastAborted = false;
    updateSendButtonUI();

    appendMessageUI('user', text);

    const loaderId = appendLoaderUI();
    state.currentLoaderId = loaderId;
    const startTime = Date.now();

    try {
        const aiResponse = await AppAPI.sendMessageToAI(state.activeChatId, text);

        if (state.isAborted) {
            state.isAborted = false;
            return;
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';

        removeLoaderUI(loaderId);
        state.currentLoaderId = null;
        appendMessageUI('assistant', aiResponse, new Date().toISOString(), duration, false);
    } catch (err) {
        if (!state.isAborted) {
            removeLoaderUI(loaderId);
            state.currentLoaderId = null;
            showToast('Ошибка при получении ответа от ИИ', 'error');
            console.error(err);
        }
    } finally {
        state.isSending = false;
        state.currentLoaderId = null;
        updateSendButtonUI();
    }
}