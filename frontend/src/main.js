import { locales, hljsThemes } from './locales.js';

const state = {
    apiKey: null,
    activeChatId: null,
    chats: [],
    pinnedChatIds: JSON.parse(localStorage.getItem('pinnedChatIds') || '[]'),
    chatTags: JSON.parse(localStorage.getItem('chatTags') || '{}'),
    currentTagChatId: null,
    drafts: {},
    pendingAttachments: [],
    isSending: false,
    isAborted: false,
    wasLastAborted: false,
    isMockMode: false,
    currentLoaderId: null,
    charBlurTimer: null,
    savedTimer: null,
    starredFilter: 'current',
    uiScale: parseInt(localStorage.getItem('uiScale') || '100'),
    accentName: localStorage.getItem('accentName') || 'indigo',
    codeTheme: localStorage.getItem('codeTheme') || 'atom-one-dark',
    language: localStorage.getItem('language') || 'en',
    lastUserPrompt: '',
};

let mockBookmarks = [
    {
        id: 1,
        message_id: 101,
        chat_id: 1,
        chat_title: 'Demo Chat',
        sender: 'assistant',
        message_content: 'This is an example bookmarked message from AI in mock mode.',
        created_at: new Date().toISOString()
    }
];

function formatResponseTime(ms) {
    if (ms == null) return null;
    let val = 0;
    if (typeof ms === 'number') {
        val = ms;
    } else if (typeof ms === 'string') {
        if (ms.endsWith(' s.') || ms.endsWith(' m.') || ms.endsWith(' h.')) return ms;
        if (ms.endsWith('s')) val = parseFloat(ms) * 1000;
        else if (ms.endsWith('ms')) val = parseFloat(ms);
        else val = parseFloat(ms);
    }

    if (isNaN(val)) return ms;

    if (val < 60000) {
        return (val / 1000).toFixed(2) + ' s.';
    } else if (val < 3600000) {
        const m = Math.floor(val / 60000);
        const s = Math.floor((val % 60000) / 1000);
        return `${m}.${s.toString().padStart(2, '0')} m.`;
    } else {
        const h = Math.floor(val / 3600000);
        const m = Math.floor((val % 3600000) / 60000);
        return `${h}.${m.toString().padStart(2, '0')} h.`;
    }
}

const mockResponses = [
    `Yes, I completely agree with your approach! This is the most efficient technical solution. How else can I help you?`,
    `Great question! Here is an example of concurrent channel processing in **Go** using goroutines:\n\n\`\`\`go\npackage main\n\nimport (\n\t"fmt"\n\t"time"\n)\n\nfunc worker(id int, jobs <-chan int, results chan<- int) {\n\tfor j := range jobs {\n\t\tfmt.Printf("Worker %d started job %d\\n", id, j)\n\t\ttime.Sleep(time.Millisecond * 500)\n\t\tresults <- j * 2\n\t}\n}\n\nfunc main() {\n\tjobs := make(chan int, 100)\n\tresults := make(chan int, 100)\n\n\tfor w := 1; w <= 3; w++ {\n\t\tgo worker(w, jobs, results)\n\t}\n\n\tfor j := 1; j <= 5; j++ {\n\t\tjobs <- j\n\t}\n\tclose(jobs)\n\n\tfor a := 1; a <= 5; a++ {\n\t\t<-results\n\t}\n}\n\`\`\``,
    `## System Architecture Overview\n\nDesigning modern client-server applications requires adhering to several key principles:\n\n1. **Layer Isolation (Clean Architecture):** Domain logic should not depend on frameworks or databases.\n2. **Asynchrony & Concurrency:** Utilizing background workers for heavy computations.\n3. **Caching & Persistence:** Preserving state on both client and server.\n\n> "Good code is not about how easy it is to write, but how easy it is to maintain and scale."\n\n* **Pros:** High FPS, low memory footprint.\n* **Cons:** Requires strict application state management.`,
    `Here is a ready-to-use profile card component built with **HTML & JavaScript**:\n\n\`\`\`javascript\nclass UserCard extends HTMLElement {\n  constructor() {\n    super();\n    this.attachShadow({ mode: 'open' });\n  }\n\n  connectedCallback() {\n    const name = this.getAttribute('name') || 'Guest';\n    this.shadowRoot.innerHTML = \\\`\n      <style>\n        .card { padding: 1rem; border-radius: 12px; background: #18181b; color: #fff; }\n      </style>\n      <div class="card">\n        <h3>Hello, \\\${name}!</h3>\n      </div>\n    \\\`;\n  }\n}\n\ncustomElements.define('user-card', UserCard);\n\`\`\``,
    `Below is a comparison of popular AI models for developers:\n\n| Model | Speed | Code Quality | Context Window |\n| :--- | :---: | :---: | :---: |\n| **Gemini Pro** | High | Excellent | 1M Tokens |\n| **GPT-4o** | Medium | Superior | 128k Tokens |\n| **Claude 3.5** | High | Outstanding | 200k Tokens |\n\nGeneral Recommendations:\n* Use **Gemini** for large documents and rapid prototyping.\n* Use **Claude** for deep refactoring of complex codebases.`
];

const AppAPI = {
    getChats: async () => {
        if (window.go?.bindings?.App?.GetChats) {
            return await window.go.bindings.App.GetChats();
        }
        console.warn('[Wails] Running in mock mode for GetChats');
        return [];
    },
    searchChats: async (query) => {
        if (window.go?.bindings?.App?.SearchChats) {
            return await window.go.bindings.App.SearchChats(query);
        }
        if (window.go?.bindings?.App?.SearchChat) {
            return await window.go.bindings.App.SearchChat(query);
        }
        console.warn('[Wails] Running in mock mode for SearchChats');
        const q = (query || '').toLowerCase();
        return (state.chats || []).filter(c => (c.title || c.Title || '').toLowerCase().includes(q));
    },
    getModels: async () => {
        if (window.go?.bindings?.App?.GetModels) {
            return await window.go.bindings.App.GetModels();
        }
        console.warn('[Wails] Running in mock mode for GetModels');
        return ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
    },
    createChat: async (title) => {
        if (window.go?.bindings?.App?.CreateChat) {
            return await window.go.bindings.App.CreateChat(title);
        }
        console.warn('[Wails] Running in mock mode for CreateChat');
        return Date.now();
    },
    updateChatTitle: async (chatId, title) => {
        if (window.go?.bindings?.App?.UpdateChatTitle) {
            return await window.go.bindings.App.UpdateChatTitle(chatId, title);
        }
        console.warn('[Wails] Running in mock mode for UpdateChatTitle');
        return true;
    },
    updateChatSystemPrompt: async (chatId, systemPrompt) => {
        if (window.go?.bindings?.App?.UpdateSystemPrompt) {
            return await window.go.bindings.App.UpdateSystemPrompt(chatId, systemPrompt);
        }
        return true;
    },
    updateChatModel: async (chatId, modelName) => {
        if (window.go?.bindings?.App?.UpdateChatModel) {
            return await window.go.bindings.App.UpdateChatModel(chatId, modelName);
        }
        return true;
    },
    updateChatConfiguration: async (chatId, config) => {
        if (window.go?.bindings?.App?.UpdateChatConfiguration) {
            return await window.go.bindings.App.UpdateChatConfiguration(chatId, config);
        }
        console.warn('[Wails] Running in mock mode for UpdateChatConfiguration');
        return true;
    },
    deleteChat: async (chatId) => {
        if (window.go?.bindings?.App?.DeleteChat) {
            return await window.go.bindings.App.DeleteChat(chatId);
        }
        console.warn('[Wails] Running in mock mode for DeleteChat');
        return true;
    },
    getMessages: async (chatId) => {
        if (window.go?.bindings?.App?.GetMessages) {
            return await window.go.bindings.App.GetMessages(chatId);
        }
        console.warn('[Wails] Running in mock mode for GetMessages');
        return [];
    },
    sendMessageToAI: async (chatId, prompt, systemPrompt = '', modelName = 'gemini-1.5-flash', attachments = []) => {
        if (state.isMockMode) {
            await new Promise((res) => setTimeout(res, 1000));
            const randomIndex = Math.floor(Math.random() * mockResponses.length);
            return mockResponses[randomIndex];
        }
        if (window.go?.bindings?.App?.SendMessageToAI) {
            const param = {
                prompt: prompt,
                system_prompt: systemPrompt,
                model_name: modelName
            };
            return await window.go.bindings.App.SendMessageToAI(chatId, param, attachments);
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
    },
    deleteLastResponse: async (chatId) => {
        if (window.go?.bindings?.App?.DeleteLastResponse) {
            return await window.go.bindings.App.DeleteLastResponse(chatId);
        }
        console.warn('[Wails] Running in mock mode for DeleteLastResponse');
        return true;
    },
    regenerateResponse: async (chatId, prompt, systemPrompt = '', modelName = 'gemini-1.5-flash', attachments = []) => {
        if (state.isMockMode) {
            await new Promise((res) => setTimeout(res, 1000));
            const randomIndex = Math.floor(Math.random() * mockResponses.length);
            return mockResponses[randomIndex];
        }
        if (window.go?.bindings?.App?.RegenerateResponse) {
            const param = {
                prompt: prompt,
                system_prompt: systemPrompt,
                model_name: modelName
            };
            return await window.go.bindings.App.RegenerateResponse(chatId, param, attachments);
        }
        console.warn('[Wails] Running in mock mode for RegenerateResponse');
        await new Promise((res) => setTimeout(res, 1500));
        return `Это тестовый регенерированный ответ от **ИИ** (без Go-бэкенда).`;
    },
    cancelGeneration: async () => {
        if (window.go?.bindings?.App?.CancelGeneration) {
            return await window.go.bindings.App.CancelGeneration();
        }
        return true;
    },
    setCloseBehavior: async (val) => {
        if (window.go?.bindings?.App?.SetCloseBehavior) {
            return await window.go.bindings.App.SetCloseBehavior(val);
        }
        return true;
    },
    quitApp: async () => {
        if (window.go?.bindings?.App?.QuitApp) {
            return await window.go.bindings.App.QuitApp();
        }
    },
    showWindow: async () => {
        if (window.go?.bindings?.App?.ShowWindow) {
            return await window.go.bindings.App.ShowWindow();
        }
    },
    getBookmarks: async () => {
        if (window.go?.bindings?.App?.GetBookmarks) {
            return await window.go.bindings.App.GetBookmarks();
        }
        console.warn('[Wails] Running in mock mode for GetBookmarks');
        return [...mockBookmarks];
    },
    addBookmark: async (messageId) => {
        if (window.go?.bindings?.App?.AddBookmark) {
            return await window.go.bindings.App.AddBookmark(messageId);
        }
        console.warn('[Wails] Running in mock mode for AddBookmark');
        const numId = parseInt(messageId, 10);
        if (!mockBookmarks.some(b => (b.message_id || b.MessageID) === numId)) {
            mockBookmarks.push({
                id: Date.now(),
                message_id: numId,
                chat_id: state.activeChatId || 1,
                chat_title: DOM.currentChatTitle?.textContent || 'Chat',
                sender: 'assistant',
                message_content: 'Bookmarked message content',
                created_at: new Date().toISOString()
            });
        }
        return true;
    },
    deleteBookmark: async (messageId) => {
        if (window.go?.bindings?.App?.DeleteBookmark) {
            return await window.go.bindings.App.DeleteBookmark(messageId);
        }
        console.warn('[Wails] Running in mock mode for DeleteBookmark');
        const numId = parseInt(messageId, 10);
        mockBookmarks = mockBookmarks.filter(b => (b.message_id || b.MessageID) !== numId);
        return true;
    }
};

const DOM = {
    authScreen: document.getElementById('auth-screen'),
    chatScreen: document.getElementById('chat-screen'),
    authForm: document.getElementById('auth-form'),
    apiKeyInput: document.getElementById('api-key-input'),
    btnToggleApiKey: document.getElementById('btn-toggle-api-key'),
    btnLogin: document.getElementById('btn-login'),

    sidebar: document.getElementById('sidebar'),
    btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
    btnShowSidebar: document.getElementById('btn-show-sidebar'),
    rightSidebar: document.getElementById('right-sidebar'),
    btnToggleRightSidebar: document.getElementById('btn-toggle-right-sidebar'),
    btnShowRightSidebar: document.getElementById('btn-show-right-sidebar'),
    btnHeaderToggleRightSidebar: document.getElementById('btn-header-toggle-right-sidebar'),
    systemPromptInput: document.getElementById('system-prompt-input'),
    modelSelect: document.getElementById('model-select'),

    tempSlider: document.getElementById('temp-slider'),
    tempVal: document.getElementById('temp-val'),
    toppSlider: document.getElementById('topp-slider'),
    toppVal: document.getElementById('topp-val'),
    topkInput: document.getElementById('topk-input'),
    maxTokensInput: document.getElementById('max-tokens-input'),
    safetyHateSelect: document.getElementById('safety-hate-select'),
    safetyHarassmentSelect: document.getElementById('safety-harassment-select'),
    safetyDangerousSelect: document.getElementById('safety-dangerous-select'),
    safetyExplicitSelect: document.getElementById('safety-explicit-select'),

    mockModeToggle: document.getElementById('mock-mode-toggle'),
    searchChatInput: document.getElementById('search-chat-input'),
    chatList: document.getElementById('chat-list'),
    btnNewChat: document.getElementById('btn-new-chat'),
    btnLogout: document.getElementById('btn-logout'),

    currentChatTitleContainer: document.getElementById('current-chat-title-container'),
    currentChatTitle: document.getElementById('current-chat-title'),
    chatTitlePencil: document.getElementById('chat-title-pencil'),
    chatTitleInput: document.getElementById('chat-title-input'),

    btnExportChat: document.getElementById('btn-export-chat'),
    btnStarredModal: document.getElementById('btn-starred-modal'),
    btnSettingsModal: document.getElementById('btn-settings-modal'),
    btnDeleteChat: document.getElementById('btn-delete-chat'),
    savedStatus: document.getElementById('saved-status'),

    btnZoomDec: document.getElementById('btn-zoom-dec'),
    btnZoomInc: document.getElementById('btn-zoom-inc'),
    zoomVal: document.getElementById('zoom-val'),

    exportModal: document.getElementById('export-modal'),
    btnCloseExportModal: document.getElementById('btn-close-export-modal'),
    btnExportMd: document.getElementById('btn-export-md'),
    btnExportJson: document.getElementById('btn-export-json'),

    deleteChatModal: document.getElementById('delete-chat-modal'),
    btnCancelDeleteChat: document.getElementById('btn-cancel-delete-chat'),
    btnConfirmDeleteChat: document.getElementById('btn-confirm-delete-chat'),

    starredModal: document.getElementById('starred-modal'),
    btnCloseStarredModal: document.getElementById('btn-close-starred-modal'),
    tabBtnStarredCurrent: document.getElementById('tab-btn-starred-current'),
    tabBtnStarredAll: document.getElementById('tab-btn-starred-all'),
    starredMessagesList: document.getElementById('starred-messages-list'),

    settingsModal: document.getElementById('settings-modal'),
    btnCloseSettingsModal: document.getElementById('btn-close-settings-modal'),
    tabBtnAppearance: document.getElementById('tab-btn-appearance'),
    tabBtnShortcuts: document.getElementById('tab-btn-shortcuts'),
    tabBtnAdvanced: document.getElementById('tab-btn-advanced'),
    tabContentAppearance: document.getElementById('tab-content-appearance'),
    tabContentShortcuts: document.getElementById('tab-content-shortcuts'),
    tabContentAdvanced: document.getElementById('tab-content-advanced'),
    closeBehaviorSelect: document.getElementById('close-behavior-select'),

    closeConfirmModal: document.getElementById('close-confirm-modal'),
    cbRememberCloseChoice: document.getElementById('cb-remember-close-choice'),
    btnCloseModalMinimize: document.getElementById('btn-close-modal-minimize'),
    btnCloseModalQuit: document.getElementById('btn-close-modal-quit'),

    codeThemeSelect: document.getElementById('code-theme-select'),
    languageSelect: document.getElementById('language-select'),

    tagModal: document.getElementById('tag-modal'),
    btnCloseTagModal: document.getElementById('btn-close-tag-modal'),
    customTagForm: document.getElementById('custom-tag-form'),
    tagColorInput: document.getElementById('tag-color-input'),
    tagNameInput: document.getElementById('tag-name-input'),
    btnSaveTag: document.getElementById('btn-save-tag'),
    btnRemoveTag: document.getElementById('btn-remove-tag'),

    messagesContainer: document.getElementById('messages-container'),
    scrollbarMarkersTrack: document.getElementById('scrollbar-markers-track'),
    btnScrollBottom: document.getElementById('btn-scroll-bottom'),
    emptyState: document.getElementById('empty-state'),
    messageForm: document.getElementById('message-form'),
    messageInput: document.getElementById('message-input'),
    charCounter: document.getElementById('char-counter'),
    btnSend: document.getElementById('btn-send'),

    fileInput: document.getElementById('file-input'),
    btnAttachFile: document.getElementById('btn-attach-file'),
    attachmentsPreviewContainer: document.getElementById('attachments-preview-container'),
    filePreviewModal: document.getElementById('file-preview-modal'),
    btnCloseFilePreview: document.getElementById('btn-close-file-preview'),
    previewFilename: document.getElementById('preview-filename'),
    filePreviewBody: document.getElementById('file-preview-body'),

    toast: document.getElementById('toast'),
    toastBox: document.getElementById('toast-box'),
    toastIconInfo: document.getElementById('toast-icon-info'),
    toastIconError: document.getElementById('toast-icon-error'),
    toastMessage: document.getElementById('toast-message'),
};

if (window.markedKatex) {
    marked.use(window.markedKatex({
        throwOnError: false,
        displayMode: false
    }));
}

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
        DOM.toastBox.className = 'flex items-center gap-3 bg-rose-950 border border-rose-500/40 text-rose-200 px-6 py-3 rounded-full shadow-2xl';
        DOM.toastIconError.classList.remove('hidden');
        DOM.toastIconInfo.classList.add('hidden');
    } else {
        DOM.toastBox.className = 'flex items-center gap-3 bg-zinc-900 border border-zinc-700/80 text-zinc-200 px-6 py-3 rounded-full shadow-2xl';
        DOM.toastIconInfo.classList.remove('hidden');
        DOM.toastIconError.classList.add('hidden');
    }

    DOM.toast.classList.remove('translate-y-20', 'opacity-0');
    DOM.toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        DOM.toast.classList.remove('translate-y-0', 'opacity-100');
        DOM.toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');

        if (DOM.toastBox) {
            DOM.toastBox.onclick = null;
            DOM.toastBox.classList.remove('cursor-pointer', 'hover:border-indigo-500');
        }
    }, duration);
}

function t(key) {
    return locales[state.language]?.[key] || locales.en[key] || key;
}

function openFilePreview(att) {
    if (!DOM.filePreviewModal) return;

    DOM.previewFilename.textContent = att.file_name;
    DOM.filePreviewBody.innerHTML = '';

    const isImage = att.mime_type.startsWith('image/');

    if (isImage) {
        const img = document.createElement('img');
        img.src = `data:${att.mime_type};base64,${att.data}`;
        img.className = 'max-w-full max-h-[60vh] rounded-2xl object-contain shadow-lg border border-zinc-800';
        DOM.filePreviewBody.appendChild(img);
    } else {
        let textContent = '';
        try {
            const binaryString = atob(att.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            textContent = new TextDecoder('utf-8').decode(bytes);
        } catch (e) {
            textContent = 'Unable to preview binary file content.';
        }

        const pre = document.createElement('pre');
        pre.className = 'w-full bg-zinc-950 p-4 rounded-2xl text-xs font-mono text-zinc-200 overflow-x-auto custom-scrollbar border border-zinc-800/80 max-h-[60vh] select-text whitespace-pre-wrap break-words [overflow-wrap:break-word]';
        const code = document.createElement('code');
        code.textContent = textContent;
        pre.appendChild(code);
        DOM.filePreviewBody.appendChild(pre);

        try {
            hljs.highlightElement(code);
        } catch (e) {
            console.error('Preview highlight error:', e);
        }
    }

    DOM.filePreviewModal.classList.remove('hidden');
}

if (DOM.btnCloseFilePreview) {
    DOM.btnCloseFilePreview.addEventListener('click', () => {
        DOM.filePreviewModal.classList.add('hidden');
    });
}

if (DOM.filePreviewModal) {
    DOM.filePreviewModal.addEventListener('click', (e) => {
        if (e.target === DOM.filePreviewModal) {
            DOM.filePreviewModal.classList.add('hidden');
        }
    });
}

function renderAttachmentsPreview() {
    if (!DOM.attachmentsPreviewContainer) return;

    if (state.pendingAttachments.length === 0) {
        DOM.attachmentsPreviewContainer.classList.add('hidden');
        DOM.attachmentsPreviewContainer.innerHTML = '';
        return;
    }

    DOM.attachmentsPreviewContainer.classList.remove('hidden');
    DOM.attachmentsPreviewContainer.innerHTML = '';

    state.pendingAttachments.forEach((att, index) => {
        const badge = document.createElement('div');
        badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 animate-fade-in shadow-md max-w-xs select-none cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/80 transition-all';

        const isImage = att.mime_type.startsWith('image/');
        const iconSvg = isImage
            ? `<svg class="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
            : `<svg class="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;

        badge.innerHTML = `
            ${iconSvg}
            <span class="truncate max-w-[140px]" title="${att.file_name}">${att.file_name}</span>
            <button type="button" class="btn-remove-att p-0.5 text-zinc-500 hover:text-rose-400 rounded-full transition-colors shrink-0" title="Remove">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;

        badge.onclick = (e) => {
            if (e.target.closest('.btn-remove-att')) return;
            openFilePreview(att);
        };

        badge.querySelector('.btn-remove-att').onclick = (e) => {
            e.stopPropagation();
            state.pendingAttachments.splice(index, 1);
            renderAttachmentsPreview();
            updateSendButtonUI();
        };

        DOM.attachmentsPreviewContainer.appendChild(badge);
    });
}

if (DOM.btnAttachFile && DOM.fileInput) {
    DOM.btnAttachFile.addEventListener('click', () => {
        DOM.fileInput.click();
    });

    DOM.fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        files.forEach(file => {
            if (file.size > 20 * 1024 * 1024) {
                showToast(`File ${file.name} is too large (>20MB)`, 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target.result;
                let base64Data = '';
                if (typeof result === 'string' && result.includes(',')) {
                    base64Data = result.split(',')[1];
                }

                state.pendingAttachments.push({
                    file_name: file.name,
                    mime_type: file.type || 'text/plain',
                    data: base64Data
                });

                renderAttachmentsPreview();
                updateSendButtonUI();
            };
            reader.readAsDataURL(file);
        });

        DOM.fileInput.value = '';
    });
}

function applyLanguage(lang) {
    state.language = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (locales[lang]?.[key]) {
            el.textContent = locales[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (locales[lang]?.[key]) {
            el.placeholder = locales[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18title;
        if (locales[lang]?.[key]) {
            el.title = locales[lang][key];
        }
    });

    if (DOM.languageSelect) DOM.languageSelect.value = lang;

    updateNetStatus();
    renderChatList();
    if (!state.activeChatId) {
        DOM.currentChatTitle.textContent = t('selectChatTitle');
    }
}

function triggerSavedStatus() {
    if (!DOM.savedStatus) return;
    DOM.savedStatus.classList.remove('opacity-0');
    DOM.savedStatus.classList.add('opacity-100');
    if (state.savedTimer) clearTimeout(state.savedTimer);
    state.savedTimer = setTimeout(() => {
        DOM.savedStatus.classList.remove('opacity-100');
        DOM.savedStatus.classList.add('opacity-0');
    }, 2000);
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
    return t('charCount');
}

function getChatDateGroup(dateStr) {
    if (!dateStr) return t('earlierGroup');
    const chatDate = new Date(dateStr);
    if (isNaN(chatDate.getTime())) return t('earlierGroup');

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const past7DaysStart = new Date(todayStart);
    past7DaysStart.setDate(past7DaysStart.getDate() - 7);

    if (chatDate >= todayStart) return t('todayGroup');
    if (chatDate >= yesterdayStart) return t('yesterdayGroup');
    if (chatDate >= past7DaysStart) return t('past7DaysGroup');
    return t('earlierGroup');
}

function applyAccentColor(accentName) {
    state.accentName = accentName;
    document.documentElement.setAttribute('data-accent', accentName);
    localStorage.setItem('accentName', accentName);

    document.querySelectorAll('.btn-accent-color').forEach(btn => {
        if (btn.dataset.accent === accentName) {
            btn.classList.remove('border-transparent');
            btn.classList.add('border-white', 'ring-2', 'ring-white/30');
        } else {
            btn.classList.remove('border-white', 'ring-2', 'ring-white/30');
            btn.classList.add('border-transparent');
        }
    });
}

function applyCodeTheme(themeKey) {
    state.codeTheme = themeKey;
    const themeUrl = hljsThemes[themeKey] || hljsThemes['atom-one-dark'];
    const hljsLink = document.getElementById('hljs-theme');
    if (hljsLink) {
        hljsLink.setAttribute('href', themeUrl);
    }
    localStorage.setItem('codeTheme', themeKey);
    if (DOM.codeThemeSelect) DOM.codeThemeSelect.value = themeKey;

    const previewCode = document.getElementById('preview-code-block');
    if (previewCode) {
        delete previewCode.dataset.highlighted;
        try {
            hljs.highlightElement(previewCode);
        } catch (e) {
            console.error('Preview highlight error:', e);
        }
    }
}

function applyUiScale() {
    document.body.style.zoom = `${state.uiScale}%`;
    DOM.zoomVal.textContent = `${state.uiScale}%`;
    localStorage.setItem('uiScale', state.uiScale);
}

function updateNetStatus() {
    if (!navigator.onLine) {
        showToast(t('netLost'), 'error');
    }
}
window.addEventListener('online', updateNetStatus);
window.addEventListener('offline', updateNetStatus);

document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="http"]');
    if (link) {
        e.preventDefault();
        const url = link.getAttribute('href');
        if (window.runtime?.BrowserOpenURL) {
            window.runtime.BrowserOpenURL(url);
        } else {
            window.open(url, '_blank');
        }
    }
});

let markersDebounceTimer = null;
function debouncedRenderScrollbarMarkers() {
    if (markersDebounceTimer) clearTimeout(markersDebounceTimer);
    markersDebounceTimer = setTimeout(renderScrollbarMarkers, 150);
}

function renderScrollbarMarkers() {
    if (!DOM.scrollbarMarkersTrack) return;

    if (!state.activeChatId) {
        DOM.scrollbarMarkersTrack.innerHTML = '';
        return;
    }

    const scrollHeight = DOM.messagesContainer.scrollHeight;
    if (scrollHeight === 0) return;

    const userMessages = DOM.messagesContainer.querySelectorAll('[data-role="user"]');

    const markersData = Array.from(userMessages).map(msgEl => ({
        el: msgEl,
        top: msgEl.offsetTop,
        rawContent: msgEl.getAttribute('data-raw-content') || ''
    }));

    const fragment = document.createDocumentFragment();

    markersData.forEach(data => {
        const rawContent = decodeURIComponent(data.rawContent);
        let promptText = rawContent.replace(/\n/g, ' ').trim();
        const displayTxt = promptText.length > 45 ? promptText.substring(0, 45) + '...' : promptText;

        const pct = (data.top / scrollHeight) * 100;

        const dot = document.createElement('div');
        dot.className = 'prompt-marker-dot';
        dot.style.top = `${pct}%`;

        dot.innerHTML = `
            <div class="prompt-marker-tooltip bg-zinc-900 border border-zinc-700/80 rounded-xl p-2 shadow-2xl text-[11px] text-zinc-200 max-w-[220px] truncate">
                ${displayTxt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </div>
        `;

        dot.onclick = () => {
            data.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        fragment.appendChild(dot);
    });

    DOM.scrollbarMarkersTrack.innerHTML = '';
    DOM.scrollbarMarkersTrack.appendChild(fragment);
}

window.addEventListener('resize', () => {
    debouncedRenderScrollbarMarkers();
});

function toggleLeftSidebar(forceState) {
    if (!DOM.sidebar) return;
    const willBeCollapsed = forceState !== undefined ? !forceState : !DOM.sidebar.classList.contains('collapsed');
    DOM.sidebar.classList.toggle('collapsed', willBeCollapsed);
    if (DOM.btnShowSidebar) {
        DOM.btnShowSidebar.classList.toggle('hidden', !willBeCollapsed);
    }
}

function toggleRightSidebar(forceState) {
    if (!DOM.rightSidebar) return;
    const willBeCollapsed = forceState !== undefined ? !forceState : !DOM.rightSidebar.classList.contains('collapsed');
    DOM.rightSidebar.classList.toggle('collapsed', willBeCollapsed);
    if (DOM.btnShowRightSidebar) {
        DOM.btnShowRightSidebar.classList.toggle('hidden', !willBeCollapsed);
    }
}

function setupCollapseUserMsg(wrapper, content) {
    const msgBox = wrapper.querySelector('.msg-box');
    const msgActions = wrapper.querySelector('.msg-actions');
    if (!msgBox || !msgActions) return;

    const oldOverlay = msgBox.querySelector('.msg-gradient-overlay');
    if (oldOverlay) oldOverlay.remove();
    const oldExpandBtn = msgActions.querySelector('.btn-expand-msg');
    if (oldExpandBtn) oldExpandBtn.remove();
    msgBox.classList.remove('max-h-[140px]', 'overflow-hidden', 'max-h-none', 'relative');

    if (content.length > 300 || msgBox.scrollHeight > 140) {
        msgBox.classList.add('max-h-[140px]', 'overflow-hidden', 'relative');

        const overlay = document.createElement('div');
        overlay.className = 'msg-gradient-overlay absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-800 to-transparent pointer-events-none rounded-b-[28px]';
        msgBox.appendChild(overlay);

        const expandBtn = document.createElement('button');
        expandBtn.className = 'btn-expand-msg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center';
        expandBtn.title = 'Expand / Collapse';
        expandBtn.innerHTML = `<svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

        let isExpanded = false;

        expandBtn.onclick = () => {
            isExpanded = !isExpanded;
            if (isExpanded) {
                msgBox.classList.remove('max-h-[140px]', 'overflow-hidden');
                msgBox.classList.add('max-h-none');
                overlay.classList.add('hidden');
                expandBtn.querySelector('svg').classList.add('rotate-180');
            } else {
                msgBox.classList.remove('max-h-none');
                msgBox.classList.add('max-h-[140px]', 'overflow-hidden');
                overlay.classList.remove('hidden');
                expandBtn.querySelector('svg').classList.remove('rotate-180');
            }
            debouncedRenderScrollbarMarkers();
        };

        msgActions.insertBefore(expandBtn, msgActions.firstChild);
    }
}

window.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;

    if (e.key === 'Escape') {
        if (DOM.searchChatInput && DOM.searchChatInput.value) {
            DOM.searchChatInput.value = '';
            AppAPI.getChats().then(chats => {
                state.chats = chats || [];
                renderChatList();
            });
            DOM.searchChatInput.blur();
        }
        DOM.exportModal.classList.add('hidden');
        DOM.starredModal.classList.add('hidden');
        DOM.settingsModal.classList.add('hidden');
        DOM.deleteChatModal.classList.add('hidden');
        DOM.tagModal.classList.add('hidden');
        if (DOM.closeConfirmModal) DOM.closeConfirmModal.classList.add('hidden');
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
        toggleLeftSidebar(true);
        DOM.searchChatInput.focus();
        DOM.searchChatInput.select();
    } else if (e.key === '\\') {
        e.preventDefault();
        toggleLeftSidebar();
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

DOM.btnSettingsModal.addEventListener('click', () => {
    DOM.settingsModal.classList.remove('hidden');
    applyCodeTheme(state.codeTheme);
});

DOM.btnCloseSettingsModal.addEventListener('click', () => {
    DOM.settingsModal.classList.add('hidden');
});

DOM.settingsModal.addEventListener('click', (e) => {
    if (e.target === DOM.settingsModal) {
        DOM.settingsModal.classList.add('hidden');
    }
});

if (DOM.tabBtnAppearance && DOM.tabBtnShortcuts && DOM.tabBtnAdvanced) {
    DOM.tabBtnAppearance.addEventListener('click', () => {
        DOM.tabBtnAppearance.className = 'px-4 py-1.5 text-accent border-b-2 border-accent font-semibold transition-colors';
        DOM.tabBtnShortcuts.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabBtnAdvanced.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabContentAppearance.classList.remove('hidden');
        DOM.tabContentShortcuts.classList.add('hidden');
        DOM.tabContentAdvanced.classList.add('hidden');
    });

    DOM.tabBtnShortcuts.addEventListener('click', () => {
        DOM.tabBtnShortcuts.className = 'px-4 py-1.5 text-accent border-b-2 border-accent font-semibold transition-colors';
        DOM.tabBtnAppearance.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabBtnAdvanced.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabContentShortcuts.classList.remove('hidden');
        DOM.tabContentAppearance.classList.add('hidden');
        DOM.tabContentAdvanced.classList.add('hidden');
    });

    DOM.tabBtnAdvanced.addEventListener('click', () => {
        DOM.tabBtnAdvanced.className = 'px-4 py-1.5 text-accent border-b-2 border-accent font-semibold transition-colors';
        DOM.tabBtnAppearance.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabBtnShortcuts.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabContentAdvanced.classList.remove('hidden');
        DOM.tabContentAppearance.classList.add('hidden');
        DOM.tabContentShortcuts.classList.add('hidden');
    });
}

document.querySelectorAll('.btn-accent-color').forEach(btn => {
    btn.onclick = () => {
        applyAccentColor(btn.dataset.accent);
    };
});

DOM.codeThemeSelect.addEventListener('change', (e) => {
    applyCodeTheme(e.target.value);
});

DOM.languageSelect.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
});

if (DOM.btnToggleSidebar) {
    DOM.btnToggleSidebar.addEventListener('click', () => toggleLeftSidebar());
}

if (DOM.btnShowSidebar) {
    DOM.btnShowSidebar.addEventListener('click', () => toggleLeftSidebar(true));
}

if (DOM.btnToggleRightSidebar) {
    DOM.btnToggleRightSidebar.addEventListener('click', () => toggleRightSidebar());
}

if (DOM.btnShowRightSidebar) {
    DOM.btnShowRightSidebar.addEventListener('click', () => toggleRightSidebar(true));
}

if (DOM.btnHeaderToggleRightSidebar) {
    DOM.btnHeaderToggleRightSidebar.addEventListener('click', () => toggleRightSidebar());
}

let systemPromptDebounceTimer = null;
if (DOM.systemPromptInput) {
    const saveSystemPrompt = () => {
        if (!state.activeChatId) return;
        const val = DOM.systemPromptInput.value;
        const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
        if (currentChat) {
            currentChat.system_prompt = val;
            currentChat.SystemPrompt = val;
        }
        AppAPI.updateChatSystemPrompt(state.activeChatId, val);
        triggerSavedStatus();
    };

    DOM.systemPromptInput.addEventListener('input', () => {
        if (systemPromptDebounceTimer) clearTimeout(systemPromptDebounceTimer);
        systemPromptDebounceTimer = setTimeout(saveSystemPrompt, 500);
    });

    DOM.systemPromptInput.addEventListener('blur', () => {
        if (systemPromptDebounceTimer) clearTimeout(systemPromptDebounceTimer);
        saveSystemPrompt();
    });
}

if (DOM.modelSelect) {
    DOM.modelSelect.addEventListener('change', async (e) => {
        if (!state.activeChatId) return;
        const val = e.target.value;
        const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
        if (currentChat) {
            currentChat.model_name = val;
            currentChat.ModelName = val;
        }
        await AppAPI.updateChatModel(state.activeChatId, val);
        triggerSavedStatus();
    });
}

let chatConfigDebounceTimer = null;

function getChatConfig(chat) {
    if (!chat) {
        return {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            safetyHateSpeech: 'NONE',
            safetyHarassment: 'NONE',
            safetyDangerousContent: 'NONE',
            safetySexuallyExplicit: 'NONE'
        };
    }
    return {
        temperature: chat.temperature ?? chat.Temperature ?? 0.7,
        topP: chat.top_p ?? chat.topP ?? chat.TopP ?? 0.95,
        topK: chat.top_k ?? chat.topK ?? chat.TopK ?? 40,
        maxOutputTokens: chat.max_output_tokens ?? chat.maxOutputTokens ?? chat.MaxOutputTokens ?? 8192,
        safetyHateSpeech: chat.safety_hate_speech ?? chat.safetyHateSpeech ?? chat.SafetyHateSpeech ?? 'NONE',
        safetyHarassment: chat.safety_harassment ?? chat.safetyHarassment ?? chat.SafetyHarassment ?? 'NONE',
        safetyDangerousContent: chat.safety_dangerous_content ?? chat.safetyDangerousContent ?? chat.SafetyDangerousContent ?? 'NONE',
        safetySexuallyExplicit: chat.safety_sexually_explicit ?? chat.safetySexuallyExplicit ?? chat.SafetySexuallyExplicit ?? 'NONE'
    };
}

function gatherCurrentConfigFromUI() {
    return {
        temperature: parseFloat(DOM.tempSlider?.value || 0.7),
        top_p: parseFloat(DOM.toppSlider?.value || 0.95),
        top_k: parseInt(DOM.topkInput?.value || 40, 10),
        max_output_tokens: parseInt(DOM.maxTokensInput?.value || 8192, 10),
        safety_hate_speech: DOM.safetyHateSelect?.value || 'NONE',
        safety_harassment: DOM.safetyHarassmentSelect?.value || 'NONE',
        safetyDangerous_content: DOM.safetyDangerousSelect?.value || 'NONE',
        safety_sexually_explicit: DOM.safetyExplicitSelect?.value || 'NONE'
    };
}

function saveChatConfiguration() {
    if (!state.activeChatId) return;
    const cfg = gatherCurrentConfigFromUI();

    const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
    if (currentChat) {
        Object.assign(currentChat, cfg);
        currentChat.Temperature = cfg.temperature;
        currentChat.TopP = cfg.top_p;
        currentChat.TopK = cfg.top_k;
        currentChat.MaxOutputTokens = cfg.max_output_tokens;
        currentChat.SafetyHateSpeech = cfg.safety_hate_speech;
        currentChat.SafetyHarassment = cfg.safety_harassment;
        currentChat.SafetyDangerousContent = cfg.safety_dangerous_content;
        currentChat.SafetySexuallyExplicit = cfg.safety_sexually_explicit;
    }

    AppAPI.updateChatConfiguration(state.activeChatId, cfg);
    triggerSavedStatus();
}

function triggerConfigSave() {
    if (chatConfigDebounceTimer) clearTimeout(chatConfigDebounceTimer);
    chatConfigDebounceTimer = setTimeout(saveChatConfiguration, 500);
}

if (DOM.tempSlider) {
    DOM.tempSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        if (DOM.tempVal) DOM.tempVal.textContent = val;
        triggerConfigSave();
    });
}

if (DOM.toppSlider) {
    DOM.toppSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(2);
        if (DOM.toppVal) DOM.toppVal.textContent = val;
        triggerConfigSave();
    });
}

if (DOM.topkInput) {
    DOM.topkInput.addEventListener('input', () => triggerConfigSave());
}

if (DOM.maxTokensInput) {
    DOM.maxTokensInput.addEventListener('input', () => triggerConfigSave());
}

[DOM.safetyHateSelect, DOM.safetyHarassmentSelect, DOM.safetyDangerousSelect, DOM.safetyExplicitSelect].forEach(select => {
    if (select) {
        select.addEventListener('change', () => triggerConfigSave());
    }
});

if (DOM.closeBehaviorSelect) {
    DOM.closeBehaviorSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        AppAPI.setCloseBehavior(val);
    });
}

if (DOM.btnCloseModalMinimize) {
    DOM.btnCloseModalMinimize.addEventListener('click', async () => {
        if (DOM.cbRememberCloseChoice?.checked) {
            await AppAPI.setCloseBehavior("minimize");
            if (DOM.closeBehaviorSelect) DOM.closeBehaviorSelect.value = "minimize";
        }
        if (DOM.closeConfirmModal) DOM.closeConfirmModal.classList.add("hidden");
    });
}

if (DOM.btnCloseModalQuit) {
    DOM.btnCloseModalQuit.addEventListener('click', async () => {
        if (DOM.cbRememberCloseChoice?.checked) {
            await AppAPI.setCloseBehavior("quit");
            if (DOM.closeBehaviorSelect) DOM.closeBehaviorSelect.value = "quit";
        }
        if (DOM.closeConfirmModal) DOM.closeConfirmModal.classList.add("hidden");
        await AppAPI.quitApp();
    });
}

DOM.mockModeToggle.addEventListener('change', (e) => {
    state.isMockMode = e.target.checked;
    if (state.isMockMode) {
        showToast(t('mockEnabled'), 'info');
    } else {
        showToast(t('mockDisabled'), 'info');
    }
});

let searchDebounceTimer = null;
let currentSearchRequestId = 0;

DOM.searchChatInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);

    searchDebounceTimer = setTimeout(async () => {
        const requestId = ++currentSearchRequestId;
        try {
            let foundChats;
            if (query === '') {
                foundChats = await AppAPI.getChats();
                state.chats = foundChats || [];
            } else {
                foundChats = await AppAPI.searchChats(query);
            }

            if (requestId !== currentSearchRequestId) return;

            renderChatList(foundChats || []);
        } catch (err) {
            console.error('Search error:', err);
        }
    }, 300);
});

let isScrollTicking = false;
DOM.messagesContainer.addEventListener('scroll', () => {
    if (!isScrollTicking) {
        window.requestAnimationFrame(() => {
            const distanceToBottom = DOM.messagesContainer.scrollHeight - DOM.messagesContainer.scrollTop - DOM.messagesContainer.clientHeight;
            if (distanceToBottom > 200) {
                DOM.btnScrollBottom.classList.remove('hidden');
            } else {
                DOM.btnScrollBottom.classList.add('hidden');
            }
            isScrollTicking = false;
        });
        isScrollTicking = true;
    }
});

DOM.btnScrollBottom.addEventListener('click', () => {
    scrollToBottom(true);
});

function updateStarredTabsUI() {
    if (!DOM.tabBtnStarredCurrent || !DOM.tabBtnStarredAll) return;
    if (state.starredFilter === 'current') {
        DOM.tabBtnStarredCurrent.className = 'px-4 py-1.5 text-accent border-b-2 border-accent font-semibold transition-colors';
        DOM.tabBtnStarredAll.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
    } else {
        DOM.tabBtnStarredAll.className = 'px-4 py-1.5 text-accent border-b-2 border-accent font-semibold transition-colors';
        DOM.tabBtnStarredCurrent.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
    }
}

if (DOM.tabBtnStarredCurrent) {
    DOM.tabBtnStarredCurrent.addEventListener('click', async () => {
        state.starredFilter = 'current';
        updateStarredTabsUI();
        await renderStarredMessages();
    });
}

if (DOM.tabBtnStarredAll) {
    DOM.tabBtnStarredAll.addEventListener('click', async () => {
        state.starredFilter = 'all';
        updateStarredTabsUI();
        await renderStarredMessages();
    });
}

DOM.btnStarredModal.addEventListener('click', async () => {
    state.starredFilter = state.activeChatId ? 'current' : 'all';
    updateStarredTabsUI();
    await renderStarredMessages();
    DOM.starredModal.classList.remove('hidden');
});

DOM.btnCloseStarredModal.addEventListener('click', () => {
    DOM.starredModal.classList.add('hidden');
});

DOM.starredModal.addEventListener('click', (e) => {
    if (e.target === DOM.starredModal) {
        DOM.starredModal.classList.add('hidden');
    }
});

DOM.btnExportChat.addEventListener('click', () => {
    if (!state.activeChatId) {
        showToast(t('selectExportChat'), 'error');
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

function startRenameTitle() {
    if (!state.activeChatId) return;
    const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
    if (!currentChat) return;

    DOM.currentChatTitleContainer.classList.add('border-zinc-700', 'bg-zinc-900/50');
    DOM.currentChatTitleContainer.classList.remove('border-transparent');

    DOM.currentChatTitle.classList.add('hidden');
    DOM.chatTitlePencil.classList.add('hidden');
    DOM.chatTitleInput.classList.remove('hidden');

    DOM.chatTitleInput.value = currentChat.title || currentChat.Title || '';

    requestAnimationFrame(() => {
        DOM.chatTitleInput.focus();
        DOM.chatTitleInput.select();
    });
}

async function finishRenameTitle() {
    if (!state.activeChatId) return;
    const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
    if (!currentChat) return;

    const newTitle = DOM.chatTitleInput.value.trim();
    const oldTitle = currentChat.title || currentChat.Title || '';

    DOM.currentChatTitleContainer.classList.remove('border-zinc-700', 'bg-zinc-900/50');
    DOM.currentChatTitleContainer.classList.add('border-transparent');

    DOM.chatTitleInput.classList.add('hidden');
    DOM.currentChatTitle.classList.remove('hidden');
    DOM.chatTitlePencil.classList.remove('hidden');

    if (newTitle && newTitle !== oldTitle) {
        currentChat.title = newTitle;
        if (currentChat.Title) currentChat.Title = newTitle;

        DOM.currentChatTitle.textContent = newTitle;
        renderChatList();

        try {
            await AppAPI.updateChatTitle(state.activeChatId, newTitle);
            triggerSavedStatus();
        } catch (err) {
            console.error('Rename error:', err);
        }
    }
}

DOM.currentChatTitleContainer.addEventListener('click', (e) => {
    if (DOM.chatTitleInput.classList.contains('hidden')) {
        startRenameTitle();
    }
});

DOM.chatTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        DOM.chatTitleInput.blur();
    } else if (e.key === 'Escape') {
        DOM.currentChatTitleContainer.classList.remove('border-zinc-700', 'bg-zinc-900/50');
        DOM.currentChatTitleContainer.classList.add('border-transparent');
        DOM.chatTitleInput.classList.add('hidden');
        DOM.currentChatTitle.classList.remove('hidden');
        DOM.chatTitlePencil.classList.remove('hidden');
    }
});

DOM.chatTitleInput.addEventListener('blur', () => {
    finishRenameTitle();
});

DOM.btnDeleteChat.addEventListener('click', () => {
    if (!state.activeChatId) {
        showToast(t('selectChatTitle'), 'error');
        return;
    }
    DOM.deleteChatModal.classList.remove('hidden');
});

DOM.btnCancelDeleteChat.addEventListener('click', () => {
    DOM.deleteChatModal.classList.add('hidden');
});

DOM.deleteChatModal.addEventListener('click', (e) => {
    if (e.target === DOM.deleteChatModal) {
        DOM.deleteChatModal.classList.add('hidden');
    }
});

DOM.btnConfirmDeleteChat.addEventListener('click', async () => {
    if (!state.activeChatId) return;
    const idToDelete = state.activeChatId;

    DOM.deleteChatModal.classList.add('hidden');

    try {
        await AppAPI.deleteChat(idToDelete);

        state.chats = state.chats.filter(c => (c.id || c.ID) !== idToDelete);

        delete state.drafts[idToDelete];
        delete state.chatTags[idToDelete];
        localStorage.setItem('chatTags', JSON.stringify(state.chatTags));

        const pinIdx = state.pinnedChatIds.indexOf(idToDelete);
        if (pinIdx > -1) {
            state.pinnedChatIds.splice(pinIdx, 1);
            localStorage.setItem('pinnedChatIds', JSON.stringify(state.pinnedChatIds));
        }

        if (state.chats.length > 0) {
            const nextId = state.chats[0].id || state.chats[0].ID;
            await selectChat(nextId);
        } else {
            state.activeChatId = null;
            renderChatList();
            DOM.currentChatTitle.textContent = t('selectChatTitle');
            DOM.messagesContainer.innerHTML = '';
            DOM.messagesContainer.appendChild(DOM.emptyState);
            if (DOM.scrollbarMarkersTrack) DOM.scrollbarMarkersTrack.innerHTML = '';
            if (DOM.systemPromptInput) DOM.systemPromptInput.value = '';
            if (DOM.modelSelect) DOM.modelSelect.value = 'gemini-1.5-flash';
        }

        triggerSavedStatus();
    } catch (err) {
        showToast('Error deleting chat', 'error');
        console.error('Delete chat error:', err);
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

async function renderStarredMessages() {
    DOM.starredMessagesList.innerHTML = '<div class="text-center text-zinc-500 py-8 text-xs">Loading...</div>';

    try {
        const bookmarks = await AppAPI.getBookmarks() || [];
        DOM.starredMessagesList.innerHTML = '';

        let filteredBookmarks = bookmarks;
        if (state.starredFilter === 'current' && state.activeChatId) {
            filteredBookmarks = bookmarks.filter(b => (b.chat_id ?? b.ChatID) === state.activeChatId);
        }

        if (filteredBookmarks.length === 0) {
            DOM.starredMessagesList.innerHTML = `<div class="text-center text-zinc-500 py-8 text-xs">${t('noStarred')}</div>`;
            return;
        }

        filteredBookmarks.forEach(item => {
            const messageId = item.message_id ?? item.MessageID;
            const targetChatId = item.chat_id ?? item.ChatID;
            const chatTitle = item.chat_title || item.ChatTitle || 'Chat';
            const createdAt = item.created_at || item.CreatedAt;
            const sender = (item.sender || item.Sender || 'assistant').toLowerCase();
            const content = item.message_content || item.MessageContent || '';

            const div = document.createElement('div');
            div.className = 'bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs text-zinc-200 select-text animate-fade-in';
            div.setAttribute('data-starred-message-id', messageId);

            div.innerHTML = `
              <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono border-b border-zinc-800/60 pb-1.5">
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-accent">${sender === 'user' ? 'YOU' : 'AI'}</span>
                  <span class="truncate max-w-[200px]">${chatTitle}</span>
                </div>
                <span>${formatMessageTime(createdAt)}</span>
              </div>
              <div class="markdown-body">${marked.parse(content)}</div>
              <div class="flex items-center justify-end gap-1 pt-1 border-t border-zinc-800/40">
                <button class="btn-goto-star-msg p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="${t('goToMessage')}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-9-3a3 3 0 100 6 3 3 0 000-6z"/>
                  </svg>
                </button>
                <button class="btn-copy-star-text p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="${t('copyText')}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
                </button>
                <button class="btn-unstar-item p-1.5 text-amber-400 hover:text-rose-400 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="Remove Bookmark">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </button>
              </div>
            `;

            div.querySelector('.btn-goto-star-msg').onclick = async () => {
                DOM.starredModal.classList.add('hidden');

                if (targetChatId && targetChatId !== state.activeChatId) {
                    await selectChat(targetChatId);
                }

                setTimeout(() => {
                    const msgEl = DOM.messagesContainer.querySelector(`[data-message-id="${messageId}"]`);
                    if (msgEl) {
                        msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        msgEl.classList.add('ring-2', 'ring-accent', 'ring-offset-2', 'ring-offset-zinc-950', 'transition-all', 'duration-500');
                        setTimeout(() => {
                            msgEl.classList.remove('ring-2', 'ring-accent', 'ring-offset-2', 'ring-offset-zinc-950', 'transition-all', 'duration-500');
                        }, 2000);
                    }
                }, 150);
            };

            div.querySelector('.btn-copy-star-text').onclick = async function() {
                try {
                    await navigator.clipboard.writeText(content);
                    const originalHTML = this.innerHTML;
                    this.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                } catch (err) {
                    console.error('Copy error:', err);
                }
            };

            div.querySelector('.btn-unstar-item').onclick = async () => {
                try {
                    await AppAPI.deleteBookmark(messageId);
                    showToast(t('starredRemoved'), 'info');
                    div.remove();
                    if (DOM.starredMessagesList.children.length === 0) {
                        DOM.starredMessagesList.innerHTML = `<div class="text-center text-zinc-500 py-8 text-xs">${t('noStarred')}</div>`;
                    }

                    const chatMsg = DOM.messagesContainer.querySelector(`[data-message-id="${messageId}"]`);
                    if (chatMsg) {
                        const starBtn = chatMsg.querySelector('.btn-star-msg');
                        if (starBtn) {
                            starBtn.classList.remove('text-amber-400');
                            const svg = starBtn.querySelector('svg');
                            if (svg) svg.setAttribute('fill', 'none');
                        }
                    }
                } catch (err) {
                    showToast('Error removing bookmark', 'error');
                    console.error('Delete bookmark error:', err);
                }
            };

            DOM.starredMessagesList.appendChild(div);
        });
    } catch (err) {
        console.error('Bookmarks load error:', err);
        DOM.starredMessagesList.innerHTML = `<div class="text-center text-rose-400 py-8 text-xs">Error loading bookmarks</div>`;
    }
}

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
    const title = currentChat ? (currentChat.title || currentChat.Title || 'Chat') : 'Chat';
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
    showToast(t('chatExportedMd'), 'info');
});

DOM.btnExportJson.addEventListener('click', async () => {
    if (!state.activeChatId) return;
    const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
    const title = currentChat ? (currentChat.title || currentChat.Title || 'Chat') : 'Chat';
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
    showToast(t('chatExportedJson'), 'info');
});

function updateSendButtonUI() {
    if (state.isSending) {
        DOM.btnSend.disabled = false;
        DOM.btnSend.className = 'w-8 h-8 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-all duration-150 shrink-0 shadow-md flex items-center justify-center';
        DOM.btnSend.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="1.5"/>
      </svg>
    `;
        DOM.btnSend.title = t('genStopped');
    } else {
        DOM.btnSend.className = 'w-8 h-8 p-1.5 bg-accent bg-accent-hover disabled:opacity-30 text-white rounded-full transition-all duration-150 shrink-0 shadow-md flex items-center justify-center';
        DOM.btnSend.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5m0 0l-6 6m6-6l6 6"/>
      </svg>
    `;
        DOM.btnSend.title = 'Send';
        const hasText = DOM.messageInput.value.trim().length > 0;
        const hasAttachments = state.pendingAttachments.length > 0;
        DOM.btnSend.disabled = !hasText && !hasAttachments;
    }
}

DOM.authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = DOM.apiKeyInput.value.trim();

    DOM.btnLogin.disabled = true;
    DOM.btnLogin.classList.add('opacity-75');
    DOM.btnLogin.innerHTML = `<span>${t('checking')}</span>`;

    try {
        const isValid = await AppAPI.validateApiKey(key);

        if (isValid) {
            state.apiKey = key;
            localStorage.setItem('gemini_api_key', key);
            DOM.authScreen.classList.add('hidden');
            DOM.chatScreen.classList.remove('hidden');
            await initChatApp();
        } else {
            showToast(t('invalidKey'), 'error');
        }
    } catch (err) {
        showToast(t('authError'), 'error');
        console.error(err);
    } finally {
        DOM.btnLogin.disabled = false;
        DOM.btnLogin.classList.remove('opacity-75');
        DOM.btnLogin.innerHTML = `<span>${t('loginBtn')}</span>`;
    }
});

DOM.btnToggleApiKey.addEventListener('click', () => {
    const isPassword = DOM.apiKeyInput.type === 'password';

    DOM.apiKeyInput.type = isPassword ? 'text' : 'password';

    const iconOpen = DOM.btnToggleApiKey.querySelector('#icon-eye-open');
    const iconClosed = DOM.btnToggleApiKey.querySelector('#icon-eye-closed');

    if (isPassword) {
        iconOpen.classList.add('hidden');
        iconClosed.classList.remove('hidden');
    } else {
        iconOpen.classList.remove('hidden');
        iconClosed.classList.add('hidden');
    }
});

DOM.btnLogout.addEventListener('click', () => {
    state.apiKey = null;
    state.activeChatId = null;
    state.chats = [];
    state.drafts = {};
    state.pendingAttachments = [];
    localStorage.removeItem('gemini_api_key');
    DOM.chatScreen.classList.add('hidden');
    DOM.authScreen.classList.remove('hidden');
    DOM.apiKeyInput.value = '';
    DOM.messageInput.value = '';
    if (DOM.scrollbarMarkersTrack) DOM.scrollbarMarkersTrack.innerHTML = '';
    if (DOM.systemPromptInput) DOM.systemPromptInput.value = '';
    if (DOM.modelSelect) DOM.modelSelect.value = 'gemini-1.5-flash';
    renderAttachmentsPreview();
});

async function autoLoginWithSavedKey() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey && savedKey.trim().length >= 5) {
        DOM.apiKeyInput.value = savedKey;
        DOM.btnLogin.disabled = true;
        DOM.btnLogin.innerHTML = `<span>${t('checking')}</span>`;

        try {
            const isValid = await AppAPI.validateApiKey(savedKey);
            if (isValid) {
                state.apiKey = savedKey;
                DOM.authScreen.classList.add('hidden');
                DOM.chatScreen.classList.remove('hidden');
                await initChatApp();
                return;
            }
        } catch (err) {
            console.error('Auto login error:', err);
        } finally {
            DOM.btnLogin.disabled = false;
            DOM.btnLogin.innerHTML = `<span>${t('loginBtn')}</span>`;
        }
    }
}

function setupUpdateListener() {
    if (window.runtime?.EventsOn) {
        window.runtime.EventsOn("update-available", (release) => {
            const newVersion = release.tag_name || release.TagName || "v0.5.0";
            const releaseUrl = release.html_url || release.HtmlUrl;

            const messageText = t('updateAvailable').replace('{version}', newVersion);

            showToast(messageText, 'info', 10000);

            if (DOM.toastBox && releaseUrl) {
                DOM.toast.classList.remove('pointer-events-none');
                DOM.toastBox.classList.add('cursor-pointer', 'hover:border-indigo-500', 'transition-colors');

                DOM.toastBox.onclick = () => {
                    if (window.runtime?.BrowserOpenURL) {
                        window.runtime.BrowserOpenURL(releaseUrl);
                    } else {
                        window.open(releaseUrl, '_blank');
                    }
                };
            }
        });

        window.runtime.EventsOn("prompt-close-behavior", () => {
            if (DOM.closeConfirmModal) {
                DOM.closeConfirmModal.classList.remove("hidden");
            }
        });
    }
}

async function loadAvailableModels() {
    if (!DOM.modelSelect) return;
    try {
        const models = await AppAPI.getModels();
        DOM.modelSelect.innerHTML = '';
        const modelsList = (models && models.length > 0) ? models : ['gemini-1.5-flash'];
        modelsList.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            DOM.modelSelect.appendChild(opt);
        });
    } catch (err) {
        console.error('Error loading models:', err);
        DOM.modelSelect.innerHTML = '<option value="gemini-1.5-flash">gemini-1.5-flash</option>';
    }
}

async function initChatApp() {
    try {
        const savedCloseBehavior = localStorage.getItem('close_behavior') || 'default';
        AppAPI.setCloseBehavior(savedCloseBehavior);
        applyLanguage(state.language);
        applyAccentColor(state.accentName);
        applyCodeTheme(state.codeTheme);
        applyUiScale();

        await loadAvailableModels();

        const chats = await AppAPI.getChats();
        state.chats = chats || [];
        renderChatList();

        if (state.chats.length > 0) {
            const firstId = state.chats[0].id || state.chats[0].ID;
            await selectChat(firstId);
        } else {
            state.activeChatId = null;
            DOM.currentChatTitle.textContent = t('selectChatTitle');
            DOM.messagesContainer.innerHTML = '';
            DOM.messagesContainer.appendChild(DOM.emptyState);
            if (DOM.systemPromptInput) DOM.systemPromptInput.value = '';
            if (DOM.modelSelect) DOM.modelSelect.value = 'gemini-1.5-flash';
        }
    } catch (err) {
        showToast(t('chatLoadError'), 'error');
        console.error(err);
        state.chats = [];
        state.activeChatId = null;
        renderChatList();
        DOM.currentChatTitle.textContent = t('selectChatTitle');
        DOM.messagesContainer.innerHTML = '';
        DOM.messagesContainer.appendChild(DOM.emptyState);
        if (DOM.systemPromptInput) DOM.systemPromptInput.value = '';
        if (DOM.modelSelect) DOM.modelSelect.value = 'gemini-1.5-flash';
    }
}

async function createNewChat(title = 'New Chat') {
    if (DOM.btnNewChat.disabled) return;
    DOM.btnNewChat.disabled = true;
    DOM.btnNewChat.classList.add('opacity-50', 'pointer-events-none');

    try {
        const chatId = await AppAPI.createChat(title);
        const newChat = {
            id: chatId,
            title: title,
            created_at: new Date().toISOString(),
            system_prompt: '',
            model_name: 'gemini-1.5-flash',
            temperature: 0.7,
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 8192,
            safety_hate_speech: 'NONE',
            safety_harassment: 'NONE',
            safety_dangerous_content: 'NONE',
            safety_sexually_explicit: 'NONE'
        };
        state.chats.unshift(newChat);
        renderChatList();
        await selectChat(chatId);
    } catch (err) {
        showToast(t('createChatError'), 'error');
        console.error(err);
    } finally {
        DOM.btnNewChat.disabled = false;
        DOM.btnNewChat.classList.remove('opacity-50', 'pointer-events-none');
        DOM.messageInput.focus();
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

function renderChatList(customList = null) {
    DOM.chatList.innerHTML = '';

    const list = customList !== null ? customList : state.chats;

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
            const title = chat.title || chat.Title || 'Untitled';
            const tagObj = state.chatTags[id];
            const isActive = id === state.activeChatId;
            const isPinned = state.pinnedChatIds.includes(id);

            const btn = document.createElement('button');
            btn.className = `w-full text-left px-3.5 py-2 rounded-full text-xs font-medium transition-all flex flex-col gap-1 group ${
                isActive
                    ? 'bg-accent-alpha text-accent border border-accent'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`;

            btn.innerHTML = `
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2 truncate max-w-[170px]">
            ${tagObj ? `<span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${tagObj.color};" title="${tagObj.name || ''}"></span>` : ''}
            ${isPinned ? `<svg class="w-3.5 h-3.5 text-accent shrink-0 rotate-45" fill="currentColor" viewBox="0 0 24 24"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>` : ''}
            <span class="truncate">${title}</span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="btn-tag p-1 text-zinc-500 hover:text-accent rounded-full transition-colors" title="Tag">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5a1 1 0 01.707.293l7 7a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 013 12V7a4 4 0 014-4z"/></svg>
            </button>
            <button class="btn-pin p-1 text-zinc-500 hover:text-accent rounded-full transition-colors" title="${isPinned ? 'Unpin' : 'Pin'}">
              <svg class="w-3.5 h-3.5 ${isPinned ? 'rotate-45 text-accent' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </button>
          </div>
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
        renderChatGroup(pinned, t('pinnedGroup'));
    }

    const groups = {};
    groups[t('todayGroup')] = [];
    groups[t('yesterdayGroup')] = [];
    groups[t('past7DaysGroup')] = [];
    groups[t('earlierGroup')] = [];

    unpinned.forEach(chat => {
        const dateStr = chat.created_at || chat.CreatedAt;
        const grp = getChatDateGroup(dateStr);
        if (!groups[grp]) groups[grp] = [];
        groups[grp].push(chat);
    });

    [t('todayGroup'), t('yesterdayGroup'), t('past7DaysGroup'), t('earlierGroup')].forEach(grpName => {
        if (groups[grpName] && groups[grpName].length > 0) {
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
        DOM.currentChatTitle.textContent = currentChat.title || currentChat.Title || 'Untitled';
    }

    if (DOM.systemPromptInput) {
        DOM.systemPromptInput.value = currentChat?.system_prompt || currentChat?.SystemPrompt || '';
    }

    if (DOM.modelSelect) {
        DOM.modelSelect.value = currentChat?.model_name || currentChat?.ModelName || 'gemini-1.5-flash';
    }

    const cfg = getChatConfig(currentChat);

    if (DOM.tempSlider) {
        DOM.tempSlider.value = cfg.temperature;
        if (DOM.tempVal) DOM.tempVal.textContent = parseFloat(cfg.temperature).toFixed(1);
    }
    if (DOM.toppSlider) {
        DOM.toppSlider.value = cfg.topP;
        if (DOM.toppVal) DOM.toppVal.textContent = parseFloat(cfg.topP).toFixed(2);
    }
    if (DOM.topkInput) {
        DOM.topkInput.value = cfg.topK;
    }
    if (DOM.maxTokensInput) {
        DOM.maxTokensInput.value = cfg.maxOutputTokens;
    }

    if (DOM.safetyHateSelect) DOM.safetyHateSelect.value = cfg.safetyHateSpeech;
    if (DOM.safetyHarassmentSelect) DOM.safetyHarassmentSelect.value = cfg.safetyHarassment;
    if (DOM.safetyDangerousSelect) DOM.safetyDangerousSelect.value = cfg.safetyDangerousContent;
    if (DOM.safetyExplicitSelect) DOM.safetyExplicitSelect.value = cfg.safetySexuallyExplicit;

    renderChatList();

    DOM.messagesContainer.innerHTML = '';
    if (DOM.scrollbarMarkersTrack) DOM.scrollbarMarkersTrack.innerHTML = '';

    DOM.messageInput.value = state.drafts[chatId] || '';
    DOM.messageInput.style.height = 'auto';
    if (DOM.messageInput.value) {
        DOM.messageInput.style.height = `${Math.min(DOM.messageInput.scrollHeight, 192)}px`;
    }
    DOM.btnSend.disabled = !DOM.messageInput.value.trim() && state.pendingAttachments.length === 0 || state.isSending;

    const len = DOM.messageInput.value.length;
    DOM.charCounter.textContent = `${len} ${getCharWord(len)}`;

    DOM.messageInput.focus();

    await loadMessages(chatId);
}

async function loadMessages(chatId) {
    DOM.messagesContainer.innerHTML = '';

    try {
        const [messages, bookmarks] = await Promise.all([
            AppAPI.getMessages(chatId),
            AppAPI.getBookmarks()
        ]);

        if (!messages || messages.length === 0) {
            DOM.messagesContainer.appendChild(DOM.emptyState);
            return;
        }

        const bookmarkedIds = new Set((bookmarks || []).map(b => Number(b.message_id ?? b.MessageID)));

        messages.forEach((msg, idx) => {
            const role = msg.role || msg.Role;
            const content = msg.content || msg.Content;
            const attachments = msg.attachments || msg.Attachments || [];
            const msgId = msg.id ?? msg.ID ?? null;
            const isBookmarked = msgId ? bookmarkedIds.has(Number(msgId)) : false;

            if (role === 'user') {
                state.lastUserPrompt = content;
            }
            const isLastInChat = idx === messages.length - 1;

            appendMessageUI(
                role,
                content,
                msg.created_at || msg.CreatedAt,
                formatResponseTime(msg.duration || msg.Duration || null),
                false,
                isLastInChat,
                attachments,
                msgId,
                isBookmarked
            );
        });
        scrollToBottom(false);
        debouncedRenderScrollbarMarkers();
    } catch (err) {
        showToast(t('msgLoadError'), 'error');
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

        const codeWrapper = document.createElement('div');
        codeWrapper.className = 'overflow-x-auto p-4 font-mono text-sm leading-relaxed custom-scrollbar';

        const codeContentDiv = document.createElement('div');
        codeContentDiv.className = 'min-w-full';
        codeContentDiv.appendChild(code.cloneNode(true));

        const rawTextArea = document.createElement('textarea');
        rawTextArea.className = 'w-full h-48 bg-zinc-950 text-zinc-300 font-mono text-sm p-4 focus:outline-none resize-y hidden custom-scrollbar';
        rawTextArea.value = rawCodeText;
        rawTextArea.readOnly = true;

        codeWrapper.appendChild(codeContentDiv);

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-zinc-800/80 text-xs text-zinc-400 font-mono select-none';
        header.innerHTML = `
      <span>${lang}</span>
      <div class="flex items-center gap-1">
        <button class="btn-toggle-raw hover:text-zinc-100 transition-colors px-2 py-1">Raw</button>
        <button class="btn-copy-code p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-all rounded-full flex items-center justify-center" title="${t('copyCode')}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
        </button>
      </div>
    `;

        const copyBtn = header.querySelector('.btn-copy-code');
        const toggleRawBtn = header.querySelector('.btn-toggle-raw');

        let isRaw = false;

        toggleRawBtn.onclick = () => {
            isRaw = !isRaw;
            if (isRaw) {
                codeWrapper.classList.add('hidden');
                rawTextArea.classList.remove('hidden');
                toggleRawBtn.textContent = 'Code';
                toggleRawBtn.classList.add('text-accent');
            } else {
                codeWrapper.classList.remove('hidden');
                rawTextArea.classList.add('hidden');
                toggleRawBtn.textContent = 'Raw';
                toggleRawBtn.classList.remove('text-accent');
            }
        };

        copyBtn.onclick = async function() {
            try {
                await navigator.clipboard.writeText(rawCodeText);
                const originalHTML = this.innerHTML;
                this.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                setTimeout(() => {
                    this.innerHTML = originalHTML;
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

function appendEmptyAIMessageUI(createdAt = new Date().toISOString(), messageId = null) {
    return appendMessageUI('assistant', '', createdAt, null, false, true, [], messageId, false);
}

function updateAIMessageContent(wrapper, content, duration = null) {
    if (!wrapper) return;
    wrapper.setAttribute('data-raw-content', encodeURIComponent(content || ''));
    const textBody = wrapper.querySelector('.markdown-text-body');
    if (!textBody) return;

    const isUser = wrapper.getAttribute('data-role') === 'user';
    const createdAt = wrapper.getAttribute('data-created-at') || new Date().toISOString();
    const timeStr = formatMessageTime(createdAt);

    const renderFooter = () => `
      <div class="flex items-center justify-between gap-3 text-[10px] ${isUser ? 'text-zinc-400' : 'text-zinc-500'} mt-2 select-none font-mono leading-none">
        ${(!isUser && duration) ? `<span class="opacity-0 group-hover:opacity-100 transition-opacity text-accent font-medium">${duration}</span>` : '<span></span>'}
        <span>${timeStr}</span>
      </div>
    `;

    textBody.innerHTML = marked.parse(content) + renderFooter();
}

function appendMessageUI(role, content, createdAt, duration = null, isAborted = false, isLastInChat = false, attachments = [], messageId = null, isStarred = false) {
    if (DOM.messagesContainer.contains(DOM.emptyState)) {
        DOM.messagesContainer.removeChild(DOM.emptyState);
    }

    const isUser = role === 'user';
    const timeStr = formatMessageTime(createdAt);
    const wrapper = document.createElement('div');
    wrapper.className = `flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in mb-4`;

    wrapper.setAttribute('data-role', role);
    wrapper.setAttribute('data-created-at', createdAt);
    wrapper.setAttribute('data-raw-content', encodeURIComponent(content || ''));
    if (messageId) {
        wrapper.setAttribute('data-message-id', messageId);
    }

    const renderFooter = () => `
      <div class="flex items-center justify-between gap-3 text-[10px] ${isUser ? 'text-zinc-400' : 'text-zinc-500'} mt-2 select-none font-mono leading-none">
        ${(!isUser && duration) ? `<span class="opacity-0 group-hover:opacity-100 transition-opacity text-accent font-medium">${duration}</span>` : '<span></span>'}
        <span>${timeStr}</span>
      </div>
    `;

    wrapper.innerHTML = `
    <div class="flex gap-4 max-w-4xl w-full group ${isUser ? 'flex-row-reverse' : 'flex-row'}">
      <div class="user-avatar w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white shadow-sm mt-0.5 ${isUser ? 'bg-zinc-700' : 'bg-transparent border border-zinc-700/80 text-accent'}">
        ${isUser ? 'YOU' : 'AI'}
      </div>

      <div class="flex flex-col gap-1 min-w-0 ${isUser ? 'items-end' : 'items-start w-full'}">
        <div class="msg-box select-text relative transition-all duration-200 ${
        isUser
            ? 'bg-zinc-800 text-zinc-100 px-6 py-3.5 rounded-[28px] markdown-body markdown-user shadow-sm w-auto break-words max-w-full [overflow-wrap:break-word]'
            : 'text-zinc-200 markdown-body w-full'
    }">
          <div class="msg-attachments-container hidden flex flex-wrap gap-2 mb-2.5"></div>
          <div class="markdown-text-body break-words w-full max-w-full [overflow-wrap:break-word]"></div>
        </div>

        <div class="msg-actions flex items-center gap-1 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          ${isUser ? `
          <button class="btn-edit-msg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="${t('editPrompt')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          ` : ''}
          <button class="btn-copy-msg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="${t('copyText')}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
          </button>
          <button class="btn-star-msg p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center ${isStarred ? 'text-amber-400' : ''}" title="Bookmark">
            <svg class="w-5 h-5" fill="${isStarred ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </button>
          ${(!isUser && isLastInChat) ? `
          <button class="btn-regenerate-msg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="${t('regenerate')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          </button>
          ` : ''}
          ${(!isUser && isAborted) ? `
            <button class="btn-continue-ai flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-zinc-800/60 transition-all px-3 py-1.5 rounded-full">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
              <span>${t('continueGen')}</span>
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

    const attContainer = wrapper.querySelector('.msg-attachments-container');
    if (attachments && attachments.length > 0 && attContainer) {
        attContainer.classList.remove('hidden');
        attachments.forEach(att => {
            const fileName = att.file_name || att.FileName || 'file';
            const mimeType = att.mime_type || att.MimeType || 'text/plain';
            const data = att.data || att.Data || '';

            const badge = document.createElement('div');
            badge.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-xs text-zinc-200 cursor-pointer hover:border-indigo-500 hover:bg-zinc-800 transition-all select-none shadow-sm';

            const isImage = mimeType.startsWith('image/');
            const iconSvg = isImage
                ? `<svg class="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
                : `<svg class="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;

            badge.innerHTML = `${iconSvg}<span class="truncate max-w-[140px]" title="${fileName}">${fileName}</span>`;
            badge.onclick = () => openFilePreview({ file_name: fileName, mime_type: mimeType, data: data });
            attContainer.appendChild(badge);
        });
    }

    const textBody = wrapper.querySelector('.markdown-text-body');

    const finalizeMessage = () => {
        textBody.innerHTML = marked.parse(content || '') + renderFooter();
        processCodeBlocks(textBody);
        scrollToBottom(true);
        triggerSavedStatus();
        debouncedRenderScrollbarMarkers();
    };

    finalizeMessage();

    const editBtn = wrapper.querySelector('.btn-edit-msg');
    if (editBtn) {
        editBtn.onclick = () => {
            const msgBox = wrapper.querySelector('.msg-box');
            const msgActions = wrapper.querySelector('.msg-actions');
            const currentRaw = decodeURIComponent(wrapper.getAttribute('data-raw-content') || '');

            const editBox = document.createElement('div');
            editBox.className = 'w-full flex flex-col gap-2 my-1 items-end';
            editBox.innerHTML = `
              <textarea class="edit-textarea w-full min-w-[280px] sm:min-w-[380px] min-h-[80px] max-h-36 bg-zinc-900 border border-zinc-700/80 rounded-2xl p-3.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-all resize-none custom-scrollbar leading-relaxed break-words [overflow-wrap:break-word]">${currentRaw.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
              <div class="flex items-center gap-2">
                <button class="btn-cancel-edit px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs font-medium transition-colors">${t('btnCancel')}</button>
                <button class="btn-save-edit px-3.5 py-1.5 bg-accent bg-accent-hover text-white rounded-full text-xs font-medium transition-colors shadow-md">${t('btnSaveSubmit')}</button>
              </div>
            `;

            msgBox.classList.add('hidden');
            msgActions.classList.add('hidden');
            msgBox.parentNode.insertBefore(editBox, msgActions);

            const textarea = editBox.querySelector('.edit-textarea');
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);

            editBox.querySelector('.btn-cancel-edit').onclick = () => {
                editBox.remove();
                msgBox.classList.remove('hidden');
                msgActions.classList.remove('hidden');
            };

            editBox.querySelector('.btn-save-edit').onclick = async () => {
                const updatedPrompt = textarea.value.trim();
                if (!updatedPrompt) return;

                editBox.remove();
                msgBox.classList.remove('hidden');
                msgActions.classList.remove('hidden');

                let nextEl = wrapper.nextElementSibling;
                while (nextEl) {
                    const toRemove = nextEl;
                    nextEl = nextEl.nextElementSibling;
                    toRemove.remove();
                }

                wrapper.setAttribute('data-raw-content', encodeURIComponent(updatedPrompt));
                textBody.innerHTML = marked.parse(updatedPrompt) + renderFooter();
                processCodeBlocks(textBody);

                setupCollapseUserMsg(wrapper, updatedPrompt);

                state.lastUserPrompt = updatedPrompt;

                if (state.isSending) {
                    state.isAborted = true;
                    await AppAPI.cancelGeneration();
                    if (window.runtime?.EventsOff) {
                        window.runtime.EventsOff("ai-stream-chunk");
                    }
                    if (state.currentLoaderId) {
                        removeLoaderUI(state.currentLoaderId);
                        state.currentLoaderId = null;
                    }
                }

                state.isSending = true;
                state.isAborted = false;
                updateSendButtonUI();

                await triggerAIGeneration(updatedPrompt, false, attachments);
            };
        };
    }

    const copyMsgBtn = wrapper.querySelector('.btn-copy-msg');
    if (copyMsgBtn) {
        copyMsgBtn.onclick = async function() {
            try {
                const currentRaw = decodeURIComponent(wrapper.getAttribute('data-raw-content') || '');
                await navigator.clipboard.writeText(currentRaw);
                const originalHTML = this.innerHTML;
                this.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                console.error('Copy message error:', err);
            }
        };
    }

    const starBtn = wrapper.querySelector('.btn-star-msg');
    if (starBtn) {
        starBtn.onclick = async () => {
            let currentMsgId = parseInt(wrapper.getAttribute('data-message-id'), 10);
            if (!currentMsgId || isNaN(currentMsgId)) {
                showToast("Please wait, saving message...", "info");
                return;
            }

            const isCurrentlyStarred = starBtn.classList.contains('text-amber-400');

            const setStarredUI = (active) => {
                if (active) {
                    starBtn.classList.add('text-amber-400');
                    const svg = starBtn.querySelector('svg');
                    if (svg) svg.setAttribute('fill', 'currentColor');
                } else {
                    starBtn.classList.remove('text-amber-400');
                    const svg = starBtn.querySelector('svg');
                    if (svg) svg.setAttribute('fill', 'none');
                }
            };

            setStarredUI(!isCurrentlyStarred);

            try {
                if (isCurrentlyStarred) {
                    await AppAPI.deleteBookmark(currentMsgId);
                    showToast(t('starredRemoved'), 'info');
                } else {
                    await AppAPI.addBookmark(currentMsgId);
                    showToast(t('starredAdded'), 'info');
                }
            } catch (err) {
                console.error('Bookmark toggle error:', err);
                setStarredUI(isCurrentlyStarred);
                showToast(isCurrentlyStarred ? 'Error removing bookmark' : 'Error adding bookmark', 'error');
            }
        };
    }

    const regenerateBtn = wrapper.querySelector('.btn-regenerate-msg');
    if (regenerateBtn) {
        regenerateBtn.onclick = async () => {
            if (state.isSending || !state.lastUserPrompt) return;

            state.isSending = true;
            updateSendButtonUI();

            try {
                wrapper.remove();
                debouncedRenderScrollbarMarkers();
                await triggerAIGeneration(state.lastUserPrompt, true);
            } catch (err) {
                state.isSending = false;
                updateSendButtonUI();
                showToast(t('aiError'), 'error');
                console.error('Regenerate error:', err);
            }
        };
    }

    const continueBtn = wrapper.querySelector('.btn-continue-ai');
    if (continueBtn) {
        continueBtn.onclick = () => {
            DOM.messageInput.value = 'Continue from where you left off';
            DOM.messageInput.dispatchEvent(new Event('input'));
            handleSendMessage();
        };
    }

    DOM.messagesContainer.appendChild(wrapper);

    if (isUser) {
        setupCollapseUserMsg(wrapper, content || '');
    }

    scrollToBottom(true);
    return wrapper;
}

function appendLoaderUI() {
    const loaderId = `loader-${Date.now()}`;
    const wrapper = document.createElement('div');
    wrapper.id = loaderId;
    wrapper.className = 'flex w-full justify-start animate-fade-in mb-4';

    wrapper.innerHTML = `
    <div class="flex gap-4 max-w-4xl w-full flex-row">
      <div class="w-8 h-8 rounded-full bg-transparent border border-zinc-700/80 text-accent flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
        AI
      </div>
      <div class="py-2 text-zinc-400 flex items-center gap-1.5 w-full">
        <div class="w-2 h-2 bg-accent rounded-full animate-pulse-fast"></div>
        <div class="w-2 h-2 bg-accent rounded-full animate-pulse-fast [animation-delay:0.2s]"></div>
        <div class="w-2 h-2 bg-accent rounded-full animate-pulse-fast [animation-delay:0.4s]"></div>
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
    const newHeight = `${Math.min(DOM.messageInput.scrollHeight, 192)}px`;
    if (DOM.messageInput.style.height !== newHeight) {
        DOM.messageInput.style.height = newHeight;
        debouncedRenderScrollbarMarkers();
    } else {
        DOM.messageInput.style.height = newHeight;
    }

    if (!state.isSending) {
        updateSendButtonUI();
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

async function triggerAIGeneration(prompt, isRegenerate = false, attachments = []) {
    const targetChatId = state.activeChatId;
    const systemPrompt = DOM.systemPromptInput ? DOM.systemPromptInput.value.trim() : '';
    const selectedModel = DOM.modelSelect ? DOM.modelSelect.value : 'gemini-1.5-flash';
    const loaderId = appendLoaderUI();
    state.currentLoaderId = loaderId;
    const startTime = Date.now();

    let streamedContent = "";
    let aiMsgWrapper = null;

    if (window.runtime?.EventsOn) {
        window.runtime.EventsOn("ai-stream-chunk", (chunk) => {
            if (state.isAborted) return;
            streamedContent += chunk;

            if (!aiMsgWrapper && state.activeChatId === targetChatId) {
                removeLoaderUI(loaderId);
                state.currentLoaderId = null;
                aiMsgWrapper = appendEmptyAIMessageUI();
            }

            if (aiMsgWrapper && state.activeChatId === targetChatId) {
                updateAIMessageContent(aiMsgWrapper, streamedContent);
                scrollToBottom(true);
            }
        });
    }

    try {
        const aiResponse = isRegenerate
            ? await AppAPI.regenerateResponse(targetChatId, prompt, systemPrompt, selectedModel, attachments)
            : await AppAPI.sendMessageToAI(targetChatId, prompt, systemPrompt, selectedModel, attachments);

        if (state.isAborted) {
            state.isAborted = false;
            return;
        }

        const durationMs = Date.now() - startTime;
        const duration = formatResponseTime(durationMs);
        const finalContent = streamedContent || aiResponse;

        if (state.activeChatId === targetChatId) {
            if (!aiMsgWrapper) {
                removeLoaderUI(loaderId);
                state.currentLoaderId = null;
                aiMsgWrapper = appendMessageUI('assistant', finalContent, new Date().toISOString(), duration, false, true);
            } else {
                updateAIMessageContent(aiMsgWrapper, finalContent, duration);
                processCodeBlocks(aiMsgWrapper);
                triggerSavedStatus();
                debouncedRenderScrollbarMarkers();
            }

            await loadMessages(targetChatId);
        }
    } catch (err) {
        if (!state.isAborted) {
            if (state.activeChatId === targetChatId) {
                removeLoaderUI(loaderId);
                state.currentLoaderId = null;
                showToast(t('aiError'), 'error');
            }
            console.error(err);
        }
    } finally {
        if (window.runtime?.EventsOff) {
            window.runtime.EventsOff("ai-stream-chunk");
        }
        state.isSending = false;
        if (state.activeChatId === targetChatId) {
            state.currentLoaderId = null;
        }
        updateSendButtonUI();
    }
}

async function handleSendMessage() {
    if (state.isSending) {
        state.isAborted = true;
        state.wasLastAborted = true;
        await AppAPI.cancelGeneration();
        if (window.runtime?.EventsOff) {
            window.runtime.EventsOff("ai-stream-chunk");
        }
        if (state.currentLoaderId) {
            removeLoaderUI(state.currentLoaderId);
            state.currentLoaderId = null;
        }
        state.isSending = false;
        updateSendButtonUI();
        showToast(t('genStopped'), 'info');
        return;
    }

    const text = DOM.messageInput.value.trim();
    const attachmentsToSend = [...state.pendingAttachments];

    if (!text && attachmentsToSend.length === 0) return;

    if (state.activeChatId === null) {
        await createNewChat();
        if (state.activeChatId === null) return;
    }

    delete state.drafts[state.activeChatId];
    DOM.messageInput.value = '';
    DOM.messageInput.style.height = 'auto';

    state.pendingAttachments = [];
    renderAttachmentsPreview();

    DOM.charCounter.textContent = `0 ${t('charCount')}`;

    state.isSending = true;
    state.isAborted = false;
    state.wasLastAborted = false;
    state.lastUserPrompt = text;
    updateSendButtonUI();

    appendMessageUI('user', text, new Date().toISOString(), null, false, false, attachmentsToSend);

    await triggerAIGeneration(text, false, attachmentsToSend);
}

setupUpdateListener();
autoLoginWithSavedKey();
