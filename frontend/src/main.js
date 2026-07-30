/**
 * SENIOR ARCHITECTURE: Vanilla JS Wails Connector
 */
const state = {
    apiKey: null,
    activeChatId: null,
    chats: [], // [{ id, title }]
    isSending: false,
};

const AppAPI = {
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
        if (window.go?.bindings?.App?.SendMessageToAI) {
            return await window.go.bindings.App.SendMessageToAI(chatId, text);
        }
        console.warn('[Wails] Running in mock mode for SendMessageToAI');
        await new Promise((res) => setTimeout(res, 1500)); // Имитация задержки
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

    chatList: document.getElementById('chat-list'),
    btnNewChat: document.getElementById('btn-new-chat'),
    btnLogout: document.getElementById('btn-logout'),
    currentChatTitle: document.getElementById('current-chat-title'),

    messagesContainer: document.getElementById('messages-container'),
    emptyState: document.getElementById('empty-state'),
    messageForm: document.getElementById('message-form'),
    messageInput: document.getElementById('message-input'),
    btnSend: document.getElementById('btn-send'),

    toast: document.getElementById('toast'),
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
function showToast(message, duration = 5000) {
    DOM.toastMessage.textContent = message;
    DOM.toast.classList.remove('translate-y-20', 'opacity-0');
    DOM.toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        DOM.toast.classList.remove('translate-y-0', 'opacity-100');
        DOM.toast.classList.add('translate-y-20', 'opacity-0');
    }, duration);
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
            if (state.chats.length === 0) {
                await createNewChat('Новый чат');
            }
        } else {
            showToast('Неверный API ключ! Проверь и повтори попытку.');
        }
    } catch (err) {
        showToast('Ошибка при валидации ключа');
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
    DOM.chatScreen.classList.add('hidden');
    DOM.authScreen.classList.remove('hidden');
    DOM.apiKeyInput.value = '';
});

async function createNewChat(title = 'Новый чат') {
    try {
        const chatId = await AppAPI.createChat(title);
        const newChat = { id: chatId, title: `${title} #${state.chats.length + 1}` };
        state.chats.push(newChat);
        renderChatList();
        selectChat(chatId);
    } catch (err) {
        showToast('Не удалось создать чат');
        console.error(err);
    }
}

function renderChatList() {
    DOM.chatList.innerHTML = '';

    state.chats.forEach((chat) => {
        const isActive = chat.id === state.activeChatId;
        const btn = document.createElement('button');
        btn.className = `w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${
            isActive
                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
        }`;

        btn.innerHTML = `
      <span class="truncate max-w-[170px]">${chat.title}</span>
      <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    `;

        btn.onclick = () => selectChat(chat.id);
        DOM.chatList.appendChild(btn);
    });
}

async function selectChat(chatId) {
    state.activeChatId = chatId;
    const currentChat = state.chats.find(c => c.id === chatId);
    if (currentChat) {
        DOM.currentChatTitle.textContent = currentChat.title;
    }

    renderChatList();
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

        messages.forEach(msg => appendMessageUI(msg.Role, msg.Content));
        scrollToBottom();
    } catch (err) {
        showToast('Ошибка загрузки сообщений');
        console.error(err);
    }
}

function appendMessageUI(role, content) {
    if (DOM.messagesContainer.contains(DOM.emptyState)) {
        DOM.messagesContainer.removeChild(DOM.emptyState);
    }

    const isUser = role === 'user';
    const wrapper = document.createElement('div');
    wrapper.className = `flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`;

    const htmlContent = isUser
        ? escapeHTML(content).replace(/\n/g, '<br>')
        : marked.parse(content);

    wrapper.innerHTML = `
    <div class="flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
        isUser ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-indigo-400 border border-zinc-700/50'
    }">
        ${isUser ? 'YOU' : 'AI'}
      </div>

      <div class="px-4 py-3 rounded-2xl ${
        isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none markdown-body shadow-sm'
    }">
        ${htmlContent}
      </div>
    </div>
  `;

    DOM.messagesContainer.appendChild(wrapper);
    scrollToBottom();
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
    scrollToBottom();
    return loaderId;
}

function removeLoaderUI(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) loader.remove();
}

function scrollToBottom() {
    DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

DOM.btnNewChat.addEventListener('click', () => createNewChat());

DOM.messageInput.addEventListener('input', () => {
    DOM.messageInput.style.height = 'auto';
    DOM.messageInput.style.height = `${Math.min(DOM.messageInput.scrollHeight, 192)}px`;
    DOM.btnSend.disabled = !DOM.messageInput.value.trim() || state.isSending;
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
    const text = DOM.messageInput.value.trim();
    if (!text || !state.activeChatId || state.isSending) return;

    DOM.messageInput.value = '';
    DOM.messageInput.style.height = 'auto';
    DOM.btnSend.disabled = true;
    state.isSending = true;

    appendMessageUI('user', text);

    const loaderId = appendLoaderUI();

    try {
        const aiResponse = await AppAPI.sendMessageToAI(state.activeChatId, text);

        removeLoaderUI(loaderId);
        appendMessageUI('assistant', aiResponse);
    } catch (err) {
        removeLoaderUI(loaderId);
        showToast('Ошибка при получении ответа от ИИ');
        console.error(err);
    } finally {
        state.isSending = false;
        DOM.btnSend.disabled = !DOM.messageInput.value.trim();
    }
}