const hljsThemes = {
    'atom-one-dark': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
    'vs2015': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css',
    'monokai': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai.min.css',
};

const locales = {
    en: {
        authTitle: "Authorization",
        authDesc: "Enter Gemini API Key to access AI",
        apiKeyLabel: "API Key",
        loginBtn: "Sign In",
        checking: "Checking...",
        unofficialClient: "UNOFFICIAL CLIENT",
        createdForEnthusiasts: "Created by enthusiast for enthusiasts",
        searchPlaceholder: "Search chats... (Ctrl+F)",
        newChatBtn: "New Chat",
        logoutBtn: "Change API Key",
        selectChatTitle: "Select or create a chat",
        mockMode: "Mock Mode",
        askPlaceholder: "Ask anything...",
        disclaimer: "Gemini may display inaccurate info. Double-check important facts.",
        charCount: "chars",
        exportTitle: "Export Chat",
        exportDesc: "Choose format to save conversation history:",
        downloadMd: "Download as Markdown (.md)",
        downloadJson: "Download as JSON (.json)",
        starredTitle: "Bookmarked Messages",
        noStarred: "No saved bookmarks",
        tagTitle: "Chat Tag",
        presets: "Presets",
        work: "Work",
        study: "Study",
        important: "Important",
        customTag: "Custom Tag",
        tagNamePlaceholder: "Tag name...",
        saveBtn: "Save",
        resetBtn: "Reset",
        settingsTitle: "Appearance Settings",
        accentColorLabel: "Interface Accent Color",
        codeThemeLabel: "Code Highlight Theme",
        languageLabel: "Interface Language",
        preview: "Preview:",
        previewCodeTitle: "Code Preview:",
        copyText: "Copy text",
        copied: "Copied!",
        copyCode: "Copy code",
        pinnedGroup: "Pinned",
        todayGroup: "Today",
        yesterdayGroup: "Yesterday",
        past7DaysGroup: "Previous 7 Days",
        earlierGroup: "Earlier",
        emptyStateTitle: "How can I help?",
        emptyStateDesc: "Create a new chat on the left or select an existing one to start a conversation.",
        netLost: "Internet connection lost!",
        invalidKey: "Invalid API key! Please check and try again.",
        authError: "Error validating API key",
        chatLoadError: "Error loading chat history",
        createChatError: "Failed to create chat",
        msgLoadError: "Error loading messages",
        aiError: "Error receiving response from AI",
        genStopped: "Generation stopped",
        continueGen: "Continue generation...",
        mockEnabled: "Mock Mode enabled: requests are not sent to Gemini API",
        mockDisabled: "Mock Mode disabled: using Gemini API",
        starredAdded: "Message added to bookmarks",
        starredRemoved: "Message removed from bookmarks",
        chatExportedMd: "Chat exported to Markdown",
        chatExportedJson: "Chat exported to JSON",
        selectExportChat: "Select a chat to export",
        savedStatus: "Saved",
        deleteChatTitle: "Delete Chat?",
        deleteChatConfirm: "Are you sure? All messages in this chat will be lost permanently.",
        btnCancel: "Cancel",
        btnDelete: "Delete",
        tabAppearance: "Appearance",
        tabShortcuts: "Hotkeys",
        hotkeyNewChat: "New Chat",
        hotkeySearch: "Search Chats",
        hotkeySidebar: "Toggle Sidebar",
        hotkeyMock: "Toggle Mock Mode",
        hotkeyExport: "Export Chat",
        hotkeyEsc: "Close Modals / Reset Search",
        regenerate: "Regenerate response",
    },
    ru: {
        authTitle: "Авторизация",
        authDesc: "Введи API-ключ Gemini для доступа к ИИ",
        apiKeyLabel: "API Key",
        loginBtn: "Войти в систему",
        checking: "Проверка...",
        unofficialClient: "НЕОФИЦИАЛЬНЫЙ КЛИЕНТ",
        createdForEnthusiasts: "Создан энтузиастом для энтузиастов",
        searchPlaceholder: "Поиск чатов... (Ctrl+F)",
        newChatBtn: "Новый чат",
        logoutBtn: "Сменить API-ключ",
        selectChatTitle: "Выберите или создайте чат",
        mockMode: "Mock Mode",
        askPlaceholder: "Спроси о чём угодно...",
        disclaimer: "Gemini может допускать ошибки. Проверяйте важную информацию.",
        charCount: "символов",
        exportTitle: "Экспорт чата",
        exportDesc: "Выберите формат для сохранения всей истории текущего диалога:",
        downloadMd: "Скачать как Markdown (.md)",
        downloadJson: "Скачать как JSON (.json)",
        starredTitle: "Избранные сообщения",
        noStarred: "Нет сохраненных закладок",
        tagTitle: "Метка чата",
        presets: "Пресеты",
        work: "Работа",
        study: "Учеба",
        important: "Важное",
        customTag: "Своя метка",
        tagNamePlaceholder: "Название метки...",
        saveBtn: "Сохранить",
        resetBtn: "Сбросить",
        settingsTitle: "Настройки внешнего вида",
        accentColorLabel: "Акцентный цвет интерфейса",
        codeThemeLabel: "Тема подсветки кода",
        languageLabel: "Язык интерфейса",
        preview: "Превью:",
        previewCodeTitle: "Превью кода:",
        copyText: "Скопировать текст",
        copied: "Скопировано!",
        copyCode: "Скопировать код",
        pinnedGroup: "Закрепленные",
        todayGroup: "Сегодня",
        yesterdayGroup: "Вчера",
        past7DaysGroup: "Прошлые 7 дней",
        earlierGroup: "Ранее",
        emptyStateTitle: "Чем я могу помочь?",
        emptyStateDesc: "Создай новый чат слева или выбери существующий, чтобы начать беседу.",
        netLost: "Интернет-соединение потеряно!",
        invalidKey: "Неверный API ключ! Проверь и повтори попытку.",
        authError: "Ошибка при валидации ключа",
        chatLoadError: "Ошибка загрузки истории чатов",
        createChatError: "Не удалось создать чат",
        msgLoadError: "Ошибка загрузки сообщений",
        aiError: "Ошибка при получении ответа от ИИ",
        genStopped: "Генерация остановлена",
        continueGen: "Продолжить генерацию...",
        mockEnabled: "Mock Mode включен: запросы в API Gemini не отправляются",
        mockDisabled: "Mock Mode отключен: работаем через Gemini API",
        starredAdded: "Сообщение добавлено в закладки",
        starredRemoved: "Сообщение удалено из закладок",
        chatExportedMd: "Чат экспортирован в Markdown",
        chatExportedJson: "Чат экспортирован в JSON",
        selectExportChat: "Выберите чат для экспорта",
        savedStatus: "Сохранено",
        deleteChatTitle: "Удалить чат?",
        deleteChatConfirm: "Вы уверены? Все сообщения из этого чата будут навсегда удалены.",
        btnCancel: "Отмена",
        btnDelete: "Удалить",
        tabAppearance: "Внешний вид",
        tabShortcuts: "Горячие клавиши",
        hotkeyNewChat: "Новый чат",
        hotkeySearch: "Поиск по чатам",
        hotkeySidebar: "Свернуть / развернуть сайдбар",
        hotkeyMock: "Включить / выключить Mock Mode",
        hotkeyExport: "Экспортировать чат",
        hotkeyEsc: "Закрыть модальные окна / сбросить поиск",
        regenerate: "Перегенерировать ответ",
    },
    zh: {
        authTitle: "身份验证",
        authDesc: "输入 Gemini API 密钥以访问 AI",
        apiKeyLabel: "API 密钥",
        loginBtn: "登录",
        checking: "验证中...",
        unofficialClient: "非官方客户端",
        createdForEnthusiasts: "由热心开发者制作",
        searchPlaceholder: "搜索对话... (Ctrl+F)",
        newChatBtn: "新建对话",
        logoutBtn: "更改 API 密钥",
        selectChatTitle: "选择或新建对话",
        mockMode: "模拟模式",
        askPlaceholder: "输入任何问题...",
        disclaimer: "Gemini 可能会提供不准确的信息，请核对重要事实。",
        charCount: "字符",
        exportTitle: "导出对话",
        exportDesc: "选择保存对话历史记录的格式：",
        downloadMd: "下载为 Markdown (.md)",
        downloadJson: "下载为 JSON (.json)",
        starredTitle: "收藏消息",
        noStarred: "暂无收藏消息",
        tagTitle: "对话标签",
        presets: "预设",
        work: "工作",
        study: "学习",
        important: "重要",
        customTag: "自定义标签",
        tagNamePlaceholder: "标签名称...",
        saveBtn: "保存",
        resetBtn: "重置",
        settingsTitle: "外观设置",
        accentColorLabel: "界面强调色",
        codeThemeLabel: "代码高亮主题",
        languageLabel: "界面语言",
        preview: "预览：",
        previewCodeTitle: "代码预览：",
        copyText: "复制文本",
        copied: "已复制！",
        copyCode: "复制代码",
        pinnedGroup: "已置顶",
        todayGroup: "今天",
        yesterdayGroup: "昨天",
        past7DaysGroup: "过去 7 天",
        earlierGroup: "更早",
        emptyStateTitle: "有什么我可以帮忙的？",
        emptyStateDesc: "在左侧新建对话或选择已有对话以开始聊天。",
        netLost: "网络连接已断开！",
        invalidKey: "API 密钥无效！请检查后重试。",
        authError: "验证 API 密钥时出错",
        chatLoadError: "加载对话历史记录出错",
        createChatError: "创建对话失败",
        msgLoadError: "加载消息出错",
        aiError: "获取 AI 响应时出错",
        genStopped: "已停止生成",
        continueGen: "继续生成...",
        mockEnabled: "已启用模拟模式：不会向 Gemini API 发送请求",
        mockDisabled: "已禁用模拟模式：使用 Gemini API",
        starredAdded: "消息已添加到收藏",
        starredRemoved: "消息已从收藏中移除",
        chatExportedMd: "对话已导出为 Markdown",
        chatExportedJson: "对话已导出为 JSON",
        selectExportChat: "请选择要导出的对话",
        savedStatus: "已保存",
        deleteChatTitle: "删除对话？",
        deleteChatConfirm: "您确定吗？此对话中的所有消息都将永久丢失。",
        btnCancel: "取消",
        btnDelete: "删除",
        tabAppearance: "外观",
        tabShortcuts: "快捷键",
        hotkeyNewChat: "新建对话",
        hotkeySearch: "搜索对话",
        hotkeySidebar: "切换侧边栏",
        hotkeyMock: "切换模拟模式",
        hotkeyExport: "导出对话",
        hotkeyEsc: "关闭弹窗 / 重置搜索",
        regenerate: "重新生成响应",
    },
    ja: {
        authTitle: "認証",
        authDesc: "AIにアクセスするにはGemini APIキーを入力してください",
        apiKeyLabel: "APIキー",
        loginBtn: "ログイン",
        checking: "確認中...",
        unofficialClient: "非公式クライアント",
        createdForEnthusiasts: "愛好家による愛好家的アプリ",
        searchPlaceholder: "チャットを検索... (Ctrl+F)",
        newChatBtn: "新しいチャット",
        logoutBtn: "APIキーを変更",
        selectChatTitle: "チャットを選択または作成",
        mockMode: "モックモード",
        askPlaceholder: "何でも質問してください...",
        disclaimer: "Geminiは不正確な情報を表示する可能性があります。重要な事実を確認してください。",
        charCount: "文字",
        exportTitle: "チャットのエクスポート",
        exportDesc: "会話履歴を保存する形式を選択してください:",
        downloadMd: "Markdownとしてダウンロード (.md)",
        downloadJson: "JSONとしてダウンロード (.json)",
        starredTitle: "ブックマークしたメッセージ",
        noStarred: "保存されたブックマークはありません",
        tagTitle: "チャットタグ",
        presets: "プリセット",
        work: "仕事",
        study: "学習",
        important: "重要",
        customTag: "カスタムタグ",
        tagNamePlaceholder: "タグ名...",
        saveBtn: "保存",
        resetBtn: "リセット",
        settingsTitle: "外観設定",
        accentColorLabel: "アクセントカラー",
        codeThemeLabel: "コードハイライトテーマ",
        languageLabel: "表示言語",
        preview: "プレビュー:",
        previewCodeTitle: "コードプレビュー:",
        copyText: "テキストをコピー",
        copied: "コピーしました！",
        copyCode: "コードをコピー",
        pinnedGroup: "ピン留め",
        todayGroup: "今日",
        yesterdayGroup: "昨日",
        past7DaysGroup: "過去7日間",
        earlierGroup: "それ以前",
        emptyStateTitle: "何かお手伝いできますか？",
        emptyStateDesc: "左側で新しいチャットを作成するか、既存のチャットを選択してください。",
        netLost: "インターネット接続が切断されました！",
        invalidKey: "無効なAPIキーです。確認して再試行してください。",
        authError: "APIキーの検証エラー",
        chatLoadError: "チャット履歴の読み込みエラー",
        createChatError: "チャットの作成に失敗しました",
        msgLoadError: "メッセージの読み込みエラー",
        aiError: "AI応答の受信エラー",
        genStopped: "生成を停止しました",
        continueGen: "生成を継続...",
        mockEnabled: "モックモード有効: Gemini APIへのリクエストは送信されません",
        mockDisabled: "モックモード無効: Gemini APIを使用中",
        starredAdded: "メッセージをブックマークに追加しました",
        starredRemoved: "メッセージをブックマークから削除しました",
        chatExportedMd: "チャットをMarkdownでエクスポートしました",
        chatExportedJson: "チャットをJSONでエクスポートしました",
        selectExportChat: "エクスポートするチャットを選択してください",
        savedStatus: "保存済み",
        deleteChatTitle: "チャット tool 削除しますか？",
        deleteChatConfirm: "本当によろしいですか？このチャットのすべてのメッセージが永久に失われます。",
        btnCancel: "キャンセル",
        btnDelete: "削除",
        tabAppearance: "外観",
        tabShortcuts: "ショートカット",
        hotkeyNewChat: "新しいチャット",
        hotkeySearch: "チャット検索",
        hotkeySidebar: "サイドバー切り替え",
        hotkeyMock: "モックモード切り替え",
        hotkeyExport: "チャットのエクスポート",
        hotkeyEsc: "モーダルを閉じる / 検索リセット",
        regenerate: "応答を再生成する",
    },
    ko: {
        authTitle: "인증",
        authDesc: "AI에 액세스하려면 Gemini API 키를 입력하세요",
        apiKeyLabel: "API 키",
        loginBtn: "로그인",
        checking: "확인 중...",
        unofficialClient: "비공식 클라이언트",
        createdForEnthusiasts: "열정적인 개발자가 제작",
        searchPlaceholder: "채팅 검색... (Ctrl+F)",
        newChatBtn: "새 채팅",
        logoutBtn: "API 키 변경",
        selectChatTitle: "채팅을 선택하거나 생성하세요",
        mockMode: "모의 모드",
        askPlaceholder: "무엇이든 물어보세요...",
        disclaimer: "Gemini는 부정확한 정보를 표시할 수 있습니다. 중요 정보를 확인하세요.",
        charCount: "자",
        exportTitle: "채팅 내보내기",
        exportDesc: "대화 기록을 저장할 형식을 선택하세요:",
        downloadMd: "Markdown으로 다운로드 (.md)",
        downloadJson: "JSON으로 다운로드 (.json)",
        starredTitle: "북마크된 메시지",
        noStarred: "저장된 북마크가 없습니다",
        tagTitle: "채팅 태그",
        presets: "프리셋",
        work: "업무",
        study: "공부",
        important: "중요",
        customTag: "사용자 지정 태그",
        tagNamePlaceholder: "태그 이름...",
        saveBtn: "저장",
        resetBtn: "초기화",
        settingsTitle: "모양 설정",
        accentColorLabel: "인터페이스 강조 색상",
        codeThemeLabel: "코드 하이라이트 테마",
        languageLabel: "인터페이스 언어",
        preview: "미리보기:",
        previewCodeTitle: "코드 미리보기:",
        copyText: "텍스트 복 복사",
        copied: "복사됨!",
        copyCode: "코드 복사",
        pinnedGroup: "고정됨",
        todayGroup: "오늘",
        yesterdayGroup: "어제",
        past7DaysGroup: "지난 7일",
        earlierGroup: "이전",
        emptyStateTitle: "무엇을 도와드릴까요?",
        emptyStateDesc: "왼쪽에서 새 채팅을 만들거나 기존 채팅을 선택하여 대화를 시작하세요.",
        netLost: "인터넷 연결이 끊겼습니다!",
        invalidKey: "유효하지 않은 API 키입니다. 확인 후 다시 시도하세요.",
        authError: "API 키 검증 오류",
        chatLoadError: "채팅 기록 로드 오류",
        createChatError: "채팅 생성 실패",
        msgLoadError: "메시지 로드 오류",
        aiError: "AI 응답 수신 오류",
        genStopped: "생성이 중지되었습니다",
        continueGen: "생성 계속하기...",
        mockEnabled: "모의 모드 활성화됨: Gemini API로 요청을 보내지 않습니다",
        mockDisabled: "모의 모드 비사용 중: Gemini API 사용 중",
        starredAdded: "메시지가 북마크에 추가되었습니다",
        starredRemoved: "메시지가 북마크에서 제거되었습니다",
        chatExportedMd: "채팅이 Markdown으로 내보내졌습니다",
        chatExportedJson: "채팅이 JSON으로 내보내졌습니다",
        selectExportChat: "내보낼 채팅을 선택하세요",
        savedStatus: "저장됨",
        deleteChatTitle: "채팅을 삭제하시겠습니까?",
        deleteChatConfirm: "정말 진행하시겠습니까? 이 채팅의 모든 메시지가 영구적으로 삭제됩니다.",
        btnCancel: "취소",
        btnDelete: "삭제",
        tabAppearance: "모양",
        tabShortcuts: "단축키",
        hotkeyNewChat: "새 채팅",
        hotkeySearch: "채팅 검색",
        hotkeySidebar: "사이드바 토글",
        hotkeyMock: "모의 모드 토글",
        hotkeyExport: "채팅 내보내기",
        hotkeyEsc: "모달 닫기 / 검색 초기화",
        regenerate: "응답 다시 생성",
    },
    es: {
        authTitle: "Autenticación",
        authDesc: "Introduce tu clave API de Gemini para acceder a la IA",
        apiKeyLabel: "Clave API",
        loginBtn: "Iniciar sesión",
        checking: "Comprobando...",
        unofficialClient: "CLIENTE NO OFICIAL",
        createdForEnthusiasts: "Creado por entusiastas para entusiastas",
        searchPlaceholder: "Buscar chats... (Ctrl+F)",
        newChatBtn: "Nuevo chat",
        logoutBtn: "Cambiar clave API",
        selectChatTitle: "Selecciona o crea un chat",
        mockMode: "Modo simulado",
        askPlaceholder: "Pregunta lo que quieras...",
        disclaimer: "Gemini puede cometer errores. Verifica la información importante.",
        charCount: "caracteres",
        exportTitle: "Exportar chat",
        exportDesc: "Elige el formato para guardar el historial del chat:",
        downloadMd: "Descargar como Markdown (.md)",
        downloadJson: "Descargar como JSON (.json)",
        starredTitle: "Mensajes guardados",
        noStarred: "No hay marcadores guardados",
        tagTitle: "Etiqueta de chat",
        presets: "Ajustes preestablecidos",
        work: "Trabajo",
        study: "Estudio",
        important: "Importante",
        customTag: "Etiqueta personalizada",
        tagNamePlaceholder: "Nombre de la etiqueta...",
        saveBtn: "Guardar",
        resetBtn: "Restablecer",
        settingsTitle: "Configuración de apariencia",
        accentColorLabel: "Color de acento de la interfaz",
        codeThemeLabel: "Tema de resaltado de código",
        languageLabel: "Idioma de la interfaz",
        preview: "Vista previa:",
        previewCodeTitle: "Vista previa del código:",
        copyText: "Copiar texto",
        copied: "¡Copiado!",
        copyCode: "Copiar código",
        pinnedGroup: "Fijados",
        todayGroup: "Hoy",
        yesterdayGroup: "Ayer",
        past7DaysGroup: "Últimos 7 días",
        earlierGroup: "Anteriores",
        emptyStateTitle: "¿En qué puedo ayudarte?",
        emptyStateDesc: "Crea un nuevo chat a la izquierda o selecciona uno existente para empezar.",
        netLost: "¡Conexión a Internet perdida!",
        invalidKey: "¡Clave API no válida! Comprueba e inténtalo de nuevo.",
        authError: "Error al validar la clave API",
        chatLoadError: "Error al cargar el historial de chats",
        createChatError: "No se pudo crear el chat",
        msgLoadError: "Error al cargar los mensajes",
        aiError: "Error al recibir respuesta de la IA",
        genStopped: "Generación detenida",
        continueGen: "Continuar generación...",
        mockEnabled: "Modo simulado activado: no se envían solicitudes a la API de Gemini",
        mockDisabled: "Modo simulado desactivado: usando API de Gemini",
        starredAdded: "Mensaje añadido a marcadores",
        starredRemoved: "Mensaje eliminado de marcadores",
        chatExportedMd: "Chat exportado a Markdown",
        chatExportedJson: "Chat exportado a JSON",
        selectExportChat: "Selecciona un chat para exportar",
        savedStatus: "Guardado",
        deleteChatTitle: "¿Eliminar chat?",
        deleteChatConfirm: "¿Estás seguro? Todos los mensajes de este chat se perderán permanentemente.",
        btnCancel: "Cancelar",
        btnDelete: "Eliminar",
        tabAppearance: "Apariencia",
        tabShortcuts: "Atajos de teclado",
        hotkeyNewChat: "Nuevo chat",
        hotkeySearch: "Buscar chats",
        hotkeySidebar: "Alternar barra lateral",
        hotkeyMock: "Alternar modo simulado",
        hotkeyExport: "Exportar chat",
        hotkeyEsc: "Cerrar modales / Restablecer búsqueda",
        regenerate: "Regenerar respuesta",
    },
    de: {
        authTitle: "Authentifizierung",
        authDesc: "Gib deinen Gemini API-Schlüssel ein, um auf die KI zuzugreifen",
        apiKeyLabel: "API-Schlüssel",
        loginBtn: "Anmelden",
        checking: "Überprüfe...",
        unofficialClient: "INOFFIZIELLER CLIENT",
        createdForEnthusiasts: "Von Enthusiasten für Enthusiasten entwickelt",
        searchPlaceholder: "Chats suchen... (Strg+F)",
        newChatBtn: "Neuer Chat",
        logoutBtn: "API-Schlüssel ändern",
        selectChatTitle: "Wähle oder erstelle einen Chat",
        mockMode: "Mock-Modus",
        askPlaceholder: "Frage irgendetwas...",
        disclaimer: "Gemini kann Fehler machen. Überprüfe wichtige Informationen.",
        charCount: "Zeichen",
        exportTitle: "Chat exportieren",
        exportDesc: "Wähle das Format zum Speichern des Nachrichtenverlaufs:",
        downloadMd: "Als Markdown herunterladen (.md)",
        downloadJson: "Als JSON herunterladen (.json)",
        starredTitle: "Gespeicherte Nachrichten",
        noStarred: "Keine gespeicherten Lesezeichen",
        tagTitle: "Chat-Tag",
        presets: "Voreinstellungen",
        work: "Arbeit",
        study: "Studium",
        important: "Wichtig",
        customTag: "Benutzerdefiniertes Tag",
        tagNamePlaceholder: "Tag-Name...",
        saveBtn: "Speichern",
        resetBtn: "Zurücksetzen",
        settingsTitle: "Erscheinungsbild-Einstellungen",
        accentColorLabel: "Akzentfarbe der Benutzeroberfläche",
        codeThemeLabel: "Code-Highlighting-Design",
        languageLabel: "Sprache der Benutzeroberfläche",
        preview: "Vorschau:",
        previewCodeTitle: "Code-Vorschau:",
        copyText: "Text kopieren",
        copied: "Kopiert!",
        copyCode: "Code kopieren",
        pinnedGroup: "Angeheftet",
        todayGroup: "Heute",
        yesterdayGroup: "Gestern",
        past7DaysGroup: "Letzte 7 Tage",
        earlierGroup: "Früher",
        emptyStateTitle: "Wie kann ich helfen?",
        emptyStateDesc: "Erstelle links einen neuen Chat oder wähle einen vorhandenen aus, um zu beginnen.",
        netLost: "Internetverbindung verloren!",
        invalidKey: "Ungültiger API-Schlüssel! Bitte überprüfen und erneut versuchen.",
        authError: "Fehler bei der API-Schlüssel-Validierung",
        chatLoadError: "Fehler beim Laden des Chat-Verlaufs",
        createChatError: "Chat konnte nicht erstellt werden",
        msgLoadError: "Fehler beim Laden der Nachrichten",
        aiError: "Fehler beim Empfangen der KI-Antwort",
        genStopped: "Generierung gestoppt",
        continueGen: "Generierung fortsetzen...",
        mockEnabled: "Mock-Modus aktiviert: Keine Anfragen an Gemini API",
        mockDisabled: "Mock-Modus deaktiviert: Gemini API wird verwendet",
        starredAdded: "Nachricht zu Lesezeichen hinzugefügt",
        starredRemoved: "Nachricht aus Lesezeichen entfernt",
        chatExportedMd: "Chat als Markdown exportiert",
        chatExportedJson: "Chat als JSON exportiert",
        selectExportChat: "Wähle einen Chat zum Exportieren aus",
        savedStatus: "Gespeichert",
        deleteChatTitle: "Chat löschen?",
        deleteChatConfirm: "Bist du sicher? Alle Nachrichten in diesem Chat gehen dauerhaft verloren.",
        btnCancel: "Abbrechen",
        btnDelete: "Löschen",
        tabAppearance: "Erscheinungsbild",
        tabShortcuts: "Tastenkombinationen",
        hotkeyNewChat: "Neuer Chat",
        hotkeySearch: "Chats suchen",
        hotkeySidebar: "Seitenleiste umschalten",
        hotkeyMock: "Mock-Modus umschalten",
        hotkeyExport: "Chat exportieren",
        hotkeyEsc: "Modals schließen / Suche zurücksetzen",
        regenerate: "Antwort neu generieren",
    },
    fr: {
        authTitle: "Authentification",
        authDesc: "Entrez votre clé API Gemini pour accéder à l'IA",
        apiKeyLabel: "Clé API",
        loginBtn: "Se connecter",
        checking: "Vérification...",
        unofficialClient: "CLIENT NON OFFICIEL",
        createdForEnthusiasts: "Créé par un passionné pour des passionnés",
        searchPlaceholder: "Rechercher des chats... (Ctrl+F)",
        newChatBtn: "Nouveau chat",
        logoutBtn: "Changer de clé API",
        selectChatTitle: "Sélectionnez ou créez un chat",
        mockMode: "Mode fictif",
        askPlaceholder: "Posez n'importe quelle question...",
        disclaimer: "Gemini peut afficher des informations inexactes. Vérifiez les faits importants.",
        charCount: "caractères",
        exportTitle: "Exporter le chat",
        exportDesc: "Choisissez le format pour enregistrer l'historique du chat :",
        downloadMd: "Télécharger en Markdown (.md)",
        downloadJson: "Télécharger en JSON (.json)",
        starredTitle: "Messages enregistrés",
        noStarred: "Aucun favori enregistré",
        tagTitle: "Étiquette de chat",
        presets: "Préréglages",
        work: "Travail",
        study: "Études",
        important: "Important",
        customTag: "Étiquette personnalisée",
        tagNamePlaceholder: "Nom de l'étiquette...",
        saveBtn: "Enregistrer",
        resetBtn: "Réinitialiser",
        settingsTitle: "Paramètres d'apparence",
        accentColorLabel: "Couleur d'accentuation de l'interface",
        codeThemeLabel: "Thème de coloration syntaxique",
        languageLabel: "Langue de l'interface",
        preview: "Aperçu :",
        previewCodeTitle: "Aperçu du code :",
        copyText: "Copier le texte",
        copied: "Copié !",
        copyCode: "Copier le code",
        pinnedGroup: "Epinglés",
        todayGroup: "Aujourd'hui",
        yesterdayGroup: "Hier",
        past7DaysGroup: "7 derniers jours",
        earlierGroup: "Plus ancien",
        emptyStateTitle: "Comment puis-je vous aider ?",
        emptyStateDesc: "Créez un nouveau chat sur la gauche ou sélectionnez-en un existant pour commencer.",
        netLost: "Connexion Internet perdue !",
        invalidKey: "Clé API invalide ! Veuillez vérifier et réessayer.",
        authError: "Erreur lors de la validation de la clé API",
        chatLoadError: "Erreur lors du chargement de l'historique des chats",
        createChatError: "Échec de la création du chat",
        msgLoadError: "Erreur lors du chargement des messages",
        aiError: "Erreur lors de la réception de la réponse de l'IA",
        genStopped: "Génération arrêtée",
        continueGen: "Continuer la génération...",
        mockEnabled: "Mode fictif activé : aucune requête envoyée à l'API Gemini",
        mockDisabled: "Mode fictif désactivé : utilisation de l'API Gemini",
        starredAdded: "Message ajouté aux favoris",
        starredRemoved: "Message retiré des favoris",
        chatExportedMd: "Chat exporté en Markdown",
        chatExportedJson: "Chat exporté en JSON",
        selectExportChat: "Sélectionnez un chat à exporter",
        savedStatus: "Enregistré",
        deleteChatTitle: "Supprimer le chat ?",
        deleteChatConfirm: "Êtes-vous sûr ? Tous les messages de ce chat seront définitivement perdus.",
        btnCancel: "Annuler",
        btnDelete: "Supprimer",
        tabAppearance: "Apparence",
        tabShortcuts: "Raccourcis",
        hotkeyNewChat: "Nouveau chat",
        hotkeySearch: "Rechercher des chats",
        hotkeySidebar: "Basculer la barre latérale",
        hotkeyMock: "Basculer le mode fictif",
        hotkeyExport: "Exporter le chat",
        hotkeyEsc: "Fermer les modales / Réinitialiser la recherche",
        regenerate: "Régénérer la réponse",
    },
    "pt-BR": {
        authTitle: "Autenticação",
        authDesc: "Insira sua Chave API do Gemini para acessar a IA",
        apiKeyLabel: "Chave API",
        loginBtn: "Entrar",
        checking: "Verificando...",
        unofficialClient: "CLIENT NÃO OFICIAL",
        createdForEnthusiasts: "Criado por entusiasta para entusiastas",
        searchPlaceholder: "Pesquisar chats... (Ctrl+F)",
        newChatBtn: "Novo Chat",
        logoutBtn: "Alterar Chave API",
        selectChatTitle: "Selecione ou crie um chat",
        mockMode: "Modo Simulado",
        askPlaceholder: "Pergunte qualquer coisa...",
        disclaimer: "O Gemini pode exibir informações imprecisas. Verifique fatos importantes.",
        charCount: "caracteres",
        exportTitle: "Exportar Chat",
        exportDesc: "Escolha o formato para salvar o histórico do chat:",
        downloadMd: "Baixar como Markdown (.md)",
        downloadJson: "Baixar como JSON (.json)",
        starredTitle: "Mensagens Salvas",
        noStarred: "Nenhum favorito salvo",
        tagTitle: "Tag do Chat",
        presets: "Predefinições",
        work: "Trabalho",
        study: "Estudo",
        important: "Importante",
        customTag: "Tag Personalizada",
        tagNamePlaceholder: "Nome da tag...",
        saveBtn: "Salvar",
        resetBtn: "Redefinir",
        settingsTitle: "Configurações de Aparência",
        accentColorLabel: "Cor de Destaque da Interface",
        codeThemeLabel: "Tema de Destaque de Código",
        languageLabel: "Idioma da Interface",
        preview: "Pré-visualização:",
        previewCodeTitle: "Pré-visualização do Código:",
        copyText: "Copiar texto",
        copied: "Copiado!",
        copyCode: "Copiar código",
        pinnedGroup: "Fixados",
        todayGroup: "Hoje",
        yesterdayGroup: "Ontem",
        past7DaysGroup: "Últimos 7 dias",
        earlierGroup: "Anteriores",
        emptyStateTitle: "Como posso ajudar?",
        emptyStateDesc: "Crie um novo chat à esquerda ou selecione um existente para começar.",
        netLost: "Conexão com a Internet perdida!",
        invalidKey: "Chave API inválida! Verifique e tente novamente.",
        authError: "Erro ao validar a Chave API",
        chatLoadError: "Erro ao carregar o histórico de chats",
        createChatError: "Falha ao criar o chat",
        msgLoadError: "Erro ao carregar mensagens",
        aiError: "Erro ao receber resposta da IA",
        genStopped: "Geração interrompida",
        continueGen: "Continuar geração...",
        mockEnabled: "Modo simulado ativado: nenhuma solicitação é enviada para a API Gemini",
        mockDisabled: "Modo simulado desativado: usando API Gemini",
        starredAdded: "Mensagem adicionada aos favoritos",
        starredRemoved: "Mensagem removida dos favoritos",
        chatExportedMd: "Chat exportado para Markdown",
        chatExportedJson: "Chat exportado para JSON",
        selectExportChat: "Seleziona un chat para exportar",
        savedStatus: "Salvo",
        deleteChatTitle: "Excluir chat?",
        deleteChatConfirm: "Tem certeza? Todas as mensagens neste chat serão perdidas permanentemente.",
        btnCancel: "Cancelar",
        btnDelete: "Excluir",
        tabAppearance: "Aparência",
        tabShortcuts: "Atalhos",
        hotkeyNewChat: "Novo Chat",
        hotkeySearch: "Pesquisar chats",
        hotkeySidebar: "Alternar barra lateral",
        hotkeyMock: "Alternar modo simulado",
        hotkeyExport: "Exportar chat",
        hotkeyEsc: "Fechar modais / Redefinir pesquisa",
        regenerate: "Regenerar resposta",
    },
    hi: {
        authTitle: "प्रमाणिकरण",
        authDesc: "AI तक पहुँचने के लिए अपनी Gemini API कुंजी दर्ज करें",
        apiKeyLabel: "API कुंजी",
        loginBtn: "साइन इन करें",
        checking: "जाँच हो रही है...",
        unofficialClient: "अनौपचारिक क्लाइंट",
        createdForEnthusiasts: "उत्साही लोगों द्वारा उत्साही लोगों के लिए बनाया गया",
        searchPlaceholder: "चैट खोजें... (Ctrl+F)",
        newChatBtn: "नया चैट",
        logoutBtn: "API कुंजी बदलें",
        selectChatTitle: "एक चैट चुनें या नया बनाएं",
        mockMode: "मॉक मोड",
        askPlaceholder: "कुछ भी पूछें...",
        disclaimer: "Gemini गलत जानकारी दे सकता है। महत्वपूर्ण तथ्यों की जाँच करें।",
        charCount: "वर्ण",
        exportTitle: "चैट निर्यात करें",
        exportDesc: "बातचीत का इतिहास सहेजने के लिए प्रारूप चुनें:",
        downloadMd: "Markdown के रूप में डाउनलोड करें (.md)",
        downloadJson: "JSON के रूप में डाउनलोड करें (.json)",
        starredTitle: "सहेजे गए संदेश",
        noStarred: "कोई सहेजा गया संदेश नहीं है",
        tagTitle: "चैट टैг",
        presets: "प्रिसेट",
        work: "काम",
        study: "पढ़ाई",
        important: "महत्वपूर्ण",
        customTag: "कस्टम टैг",
        tagNamePlaceholder: "टैग का नाम...",
        saveBtn: "सहेजें",
        resetBtn: "रीसेट करें",
        settingsTitle: "दिखावट सेटिंग्स",
        accentColorLabel: "इंटरफ़ेस रंग",
        codeThemeLabel: "कोड हाइलाइट थीम",
        languageLabel: "इंटरफ़ेस भाषा",
        preview: "पूर्वावलोकन:",
        previewCodeTitle: "कोड पूर्वावलोकन:",
        copyText: "पाठ कॉपी करें",
        copied: "कॉपी किया गया!",
        copyCode: "कोड कॉपी करें",
        pinnedGroup: "पिन किए गए",
        todayGroup: "आज",
        yesterdayGroup: "कल",
        past7DaysGroup: "पिछले 7 दिन",
        earlierGroup: "पहले के",
        emptyStateTitle: "मैं आपकी क्या मदद कर सकता हूँ?",
        emptyStateDesc: "बातचीत शुरू करने के लिए बाईं ओर एक नया चैट बनाएं या मौजूदा चुनें।",
        netLost: "इंटरनेट कनेक्शन टूट गया!",
        invalidKey: "अमान्य API कुंजी! कृपया जाँचें और पुनः प्रयास करें।",
        authError: "API कुंजी सत्यापन में त्रुटि",
        chatLoadError: "चैट इतिहास लोड करने में त्रुटि",
        createChatError: "चैट बनाने में विफल",
        msgLoadError: "संदेश लोड करने में त्रुटि",
        aiError: "AI प्रतिक्रिया प्राप्त करने में त्रुटि",
        genStopped: "जनरेशन रोक दिया गया",
        continueGen: "जनरेशन जारी रखें...",
        mockEnabled: "मॉक मोड सक्षम: Gemini API को अनुरोध नहीं भेजे जाते",
        mockDisabled: "मॉक मोड अक्षम: Gemini API का उपयोग किया जा रहा है",
        starredAdded: "संदेश बुकमार्क में जोड़ा गया",
        starredRemoved: "संदेश बुकमार्क से हटा दिया गया",
        chatExportedMd: "चैट Markdown में निर्यात किया गया",
        chatExportedJson: "चैट JSON में निर्यात किया गया",
        selectExportChat: "निर्यात करने के लिए एक चैट चुनें",
        savedStatus: "सहेजा गया",
        deleteChatTitle: "चैट हटाएं?",
        deleteChatConfirm: "क्या आप निश्चित हैं? इस चैट के सभी संदेश स्थायी रूप से खो जाएंगे।",
        btnCancel: "रद्द करें",
        btnDelete: "हटाएं",
        tabAppearance: "दिखावट",
        tabShortcuts: "शॉर्टकट्स",
        hotkeyNewChat: "नया चैट",
        hotkeySearch: "चैट खोजें",
        hotkeySidebar: "साइडबार बदलें",
        hotkeyMock: "मॉक मोड बदलें",
        hotkeyExport: "चैट निर्यात करें",
        hotkeyEsc: "मोडल्स बंद करें / खोज रीसेट करें",
        regenerate: "प्रतिक्रिया पुन: उत्पन्न करें",
    },
    it: {
        authTitle: "Autenticazione",
        authDesc: "Inserisci la tua chiave API Gemini per accedere all'IA",
        apiKeyLabel: "Chiave API",
        loginBtn: "Accedi",
        checking: "Verifica...",
        unofficialClient: "CLIENT NON UFFICIALE",
        createdForEnthusiasts: "Creato da appassionati per appassionati",
        searchPlaceholder: "Cerca chat... (Ctrl+F)",
        newChatBtn: "Nuova chat",
        logoutBtn: "Cambia chiave API",
        selectChatTitle: "Seleziona o crea una chat",
        mockMode: "Modalità Mock",
        askPlaceholder: "Chiedi qualsiasi cosa...",
        disclaimer: "Gemini può commettere errori. Verifica le informazioni importanti.",
        charCount: "caratteri",
        exportTitle: "Esporta chat",
        exportDesc: "Scegli il formato per salvare la cronologia della conversazione:",
        downloadMd: "Scarica come Markdown (.md)",
        downloadJson: "Scarica come JSON (.json)",
        starredTitle: "Messaggi salvati",
        noStarred: "Nessun segnalibro salvato",
        tagTitle: "Etichetta chat",
        presets: "Preimpostazioni",
        work: "Lavoro",
        study: "Studio",
        important: "Importante",
        customTag: "Etichetta personalizzata",
        tagNamePlaceholder: "Nome etichetta...",
        saveBtn: "Salva",
        resetBtn: "Ripristina",
        settingsTitle: "Impostazioni aspetto",
        accentColorLabel: "Colore di accento dell'interfaccia",
        codeThemeLabel: "Tema di evidenziazione del codice",
        languageLabel: "Lingua dell'interfaccia",
        preview: "Anteprima:",
        previewCodeTitle: "Anteprima codice:",
        copyText: "Copia testo",
        copied: "Copiato!",
        copyCode: "Copia codice",
        pinnedGroup: "Fissati",
        todayGroup: "Oggi",
        yesterdayGroup: "Ieri",
        past7DaysGroup: "Ultimi 7 giorni",
        earlierGroup: "Precedenti",
        emptyStateTitle: "Come posso aiutarti?",
        emptyStateDesc: "Crea una nuova chat a sinistra o selezionane una esistente per iniziare.",
        netLost: "Connessione Internet persa!",
        invalidKey: "Chiave API non valida! Verifica e riprova.",
        authError: "Errore durante la convalida della chiave API",
        chatLoadError: "Errore durante il caricamento della cronologia chat",
        createChatError: "Impossibile creare la chat",
        msgLoadError: "Errore durante il caricamento dei messaggi",
        aiError: "Errore durante la ricezione della risposta dall'IA",
        genStopped: "Generazione interrotta",
        continueGen: "Continua generazione...",
        mockEnabled: "Modalità Mock attivata: le richieste non vengono inviate all'API Gemini",
        mockDisabled: "Modalità Mock disattivata: utilizzo dell'API Gemini",
        starredAdded: "Messaggio aggiunto ai segnalibri",
        starredRemoved: "Messaggio rimmosso dai segnalibri",
        chatExportedMd: "Chat esportata in Markdown",
        chatExportedJson: "Chat exportata in JSON",
        selectExportChat: "Seleziona una chat da esportare",
        savedStatus: "Salvato",
        deleteChatTitle: "Eliminare la chat?",
        deleteChatConfirm: "Sei sicuro? Tutti i messaggi in questa chat andranno persi in modo permanente.",
        btnCancel: "Annulla",
        btnDelete: "Elimina",
        tabAppearance: "Aspetto",
        tabShortcuts: "Scorciatoie",
        hotkeyNewChat: "Nuova chat",
        hotkeySearch: "Cerca chat",
        hotkeySidebar: "Mostra/Nascondi barra laterale",
        hotkeyMock: "Attiva/Disattiva Modalità Mock",
        hotkeyExport: "Esporta chat",
        hotkeyEsc: "Chiudi modali / Ripristina ricerca",
        regenerate: "Rigenera risposta",
    },
    pl: {
        authTitle: "Autoryzacja",
        authDesc: "Wprowadź klucz API Gemini, aby uzyskać dostęp do AI",
        apiKeyLabel: "Klucz API",
        loginBtn: "Zaloguj się",
        checking: "Sprawdzanie...",
        unofficialClient: "NIEOFICJALNY KLIENT",
        createdForEnthusiasts: "Stworzony przez entuzjastę dla entuzjastów",
        searchPlaceholder: "Szukaj czatów... (Ctrl+F)",
        newChatBtn: "Nowy czat",
        logoutBtn: "Zmień klucz API",
        selectChatTitle: "Wybierz lub utwórz czat",
        mockMode: "Tryb Mock",
        askPlaceholder: "Zapytaj o cokolwiek...",
        disclaimer: "Gemini może popełniać błędy. Sprawdzaj ważne informacje.",
        charCount: "znaków",
        exportTitle: "Eksportuj czat",
        exportDesc: "Wybierz format zapisu historii rozmowy:",
        downloadMd: "Pobierz jako Markdown (.md)",
        downloadJson: "Pobierz jako JSON (.json)",
        starredTitle: "Zapisane wiadomości",
        noStarred: "Brak zapisanych zakładek",
        tagTitle: "Etykieta czatu",
        presets: "Ustawienia wstępne",
        work: "Praca",
        study: "Nauka",
        important: "Ważne",
        customTag: "Własna etykieta",
        tagNamePlaceholder: "Nazwa etykiety...",
        saveBtn: "Zapisz",
        resetBtn: "Resetuj",
        settingsTitle: "Ustawienia wyglądu",
        accentColorLabel: "Kolor akcentu interfejsu",
        codeThemeLabel: "Motyw podświetlania kodu",
        languageLabel: "Język interfejsu",
        preview: "Podgląd:",
        previewCodeTitle: "Podgląd kodu:",
        copyText: "Kopiuj tekst",
        copied: "Skopiowano!",
        copyCode: "Kopiuj kod",
        pinnedGroup: "Przypięte",
        todayGroup: "Dzisiaj",
        yesterdayGroup: "Wczoraj",
        past7DaysGroup: "Ostatnie 7 dni",
        earlierGroup: "Wcześniej",
        emptyStateTitle: "W czym mogę pomóc?",
        emptyStateDesc: "Utwórz nowy czat po lewej stronie lub wybierz istniejący, aby rozpocząć rozmowę.",
        netLost: "Utracono połączenie z Internetem!",
        invalidKey: "Nieprawidłowy klucz API! Sprawdź i spróbuj ponownie.",
        authError: "Błąd walidacji klucza API",
        chatLoadError: "Błąd ładowania historii czatów",
        createChatError: "Nie udało się utworzyć czatu",
        msgLoadError: "Błąd ładowania wiadomości",
        aiError: "Błąd odbierania odpowiedzi od AI",
        genStopped: "Generowanie zatrzymane",
        continueGen: "Kontнувuj generowanie...",
        mockEnabled: "Tryb Mock włączony: zapytania nie są wysyłane do API Gemini",
        mockDisabled: "Tryb Mock wyłączony: używanie API Gemini",
        starredAdded: "Wiadomość dodana do zakładek",
        starredRemoved: "Wiadomość usunięta z zakładek",
        chatExportedMd: "Czat wyeksportowany do Markdown",
        chatExportedJson: "Czat wyeksportowany do JSON",
        selectExportChat: "Wybierz czat do eksportu",
        savedStatus: "Zapisano",
        deleteChatTitle: "Usunąć czat?",
        deleteChatConfirm: "Czy na pewno? Wszystkie wiadomości w tym czacie zostaną trwale utracone.",
        btnCancel: "Anuluj",
        btnDelete: "Usuń",
        tabAppearance: "Wygląd",
        tabShortcuts: "Skróty klawiszowe",
        hotkeyNewChat: "Nowy czat",
        hotkeySearch: "Szukaj czatów",
        hotkeySidebar: "Przełącz панель boczną",
        hotkeyMock: "Przełącz Tryb Mock",
        hotkeyExport: "Eksportuj czat",
        hotkeyEsc: "Zamknij okna / Resetuj szukanie",
        regenerate: "Wygeneruj ponownie odpowiedź",
    },
    tr: {
        authTitle: "Kimlik Doğrulama",
        authDesc: "Yapay zekaya erişmek için Gemini API Anahtarınızı girin",
        apiKeyLabel: "API Anahtarı",
        loginBtn: "Giriş Yap",
        checking: "Kontrol ediliyor...",
        unofficialClient: "RESMİ OLMAYAN İSTEMCİ",
        createdForEnthusiasts: "Meraklılar tarafından meraklılar için oluşturuldu",
        searchPlaceholder: "Sohbet ara... (Ctrl+F)",
        newChatBtn: "Yeni Sohbet",
        logoutBtn: "API Anahtarını Değiştir",
        selectChatTitle: "Bir sohbet seçin veya oluşturun",
        mockMode: "Mock Modu",
        askPlaceholder: "İstediğinizi sorun...",
        disclaimer: "Gemini hata yapabilir. Önemli bilgileri kontrol edin.",
        charCount: "karakter",
        exportTitle: "Sohbeti Dışa Aktar",
        exportDesc: "Konuşma geçmişini kaydetmek için biçim seçin:",
        downloadMd: "Markdown olarak indir (.md)",
        downloadJson: "JSON olarak indir (.json)",
        starredTitle: "Yer İşaretleri",
        noStarred: "Kaydedilmiş yer işareti yok",
        tagTitle: "Sohbet Etiketi",
        presets: "Önayarlar",
        work: "İş",
        study: "Ders",
        important: "Önemli",
        customTag: "Özel Etiket",
        tagNamePlaceholder: "Etiket adı...",
        saveBtn: "Kaydet",
        resetBtn: "Sıfırla",
        settingsTitle: "Görünüm Ayarları",
        accentColorLabel: "Arayüz Vurgu Rengi",
        codeThemeLabel: "Kod Vurgulama Teması",
        languageLabel: "Arayüz Dili",
        preview: "Önizleme:",
        previewCodeTitle: "Kod Önizlemesi:",
        copyText: "Metni kopyala",
        copied: "Kopyalandı!",
        copyCode: "Kodu kopyala",
        pinnedGroup: "Sabitlenmiş",
        todayGroup: "Bugün",
        yesterdayGroup: "Dün",
        past7DaysGroup: "Son 7 Gün",
        earlierGroup: "Daha Önce",
        emptyStateTitle: "Nasıl yardımcı olabilirim?",
        emptyStateDesc: "Sohbet başlatmak için soldan yeni bir sohbet oluşturun veya var olanı seçin.",
        netLost: "İnternet bağlantısı kesildi!",
        invalidKey: "Geçersiz API anahtarı! Lütfen kontrol edip tekrar deneyin.",
        authError: "API anahtarı doğrulanırken hata oluştu",
        chatLoadError: "Sohbet geçmişi yüklenirken hata",
        createChatError: "Sohbet oluşturulamadı",
        msgLoadError: "Mesajlar yüklenirken hata",
        aiError: "Yapay zeka yanıtı alınırken hata",
        genStopped: "Üretim durduruldu",
        continueGen: "Üretmeye devam et...",
        mockEnabled: "Mock Modu etkin: Gemini API'sine istek gönderilmiyor",
        mockDisabled: "Mock Modu devre dışı: Gemini API kullanılıyor",
        starredAdded: "Mesaj yer işaretlerine eklendi",
        starredRemoved: "Mesaj yer işaretlerinden kaldırıldı",
        chatExportedMd: "Sohbet Markdown olarak dışa aktarıldı",
        chatExportedJson: "Sohbet JSON olarak dışa aktarıldı",
        selectExportChat: "Dışa aktarmak için bir sohbet seçin",
        savedStatus: "Kaydedildi",
        deleteChatTitle: "Sohbet Silinsin mi?",
        deleteChatConfirm: "Emin misiniz? Bu sohbetteki tüm mesajlar kalıcı olarak kaybolacak.",
        btnCancel: "İptal",
        btnDelete: "Sil",
        tabAppearance: "Görünüm",
        tabShortcuts: "Kısayollar",
        hotkeyNewChat: "Yeni Sohbet",
        hotkeySearch: "Sohbet Ara",
        hotkeySidebar: "Yan Paneli Değiştir",
        hotkeyMock: "Mock Modunu Değiştir",
        hotkeyExport: "Sohbeti Dışa Aktar",
        hotkeyEsc: "Pencereleri Kapat / Aramayı Sıfırla",
        regenerate: "Yanıtı yeniden oluştur",
    }
};

const state = {
    apiKey: null,
    activeChatId: null,
    chats: [],
    pinnedChatIds: JSON.parse(localStorage.getItem('pinnedChatIds') || '[]'),
    chatTags: JSON.parse(localStorage.getItem('chatTags') || '{}'),
    starredMessages: JSON.parse(localStorage.getItem('starredMessages') || '[]'),
    currentTagChatId: null,
    searchQuery: '',
    drafts: {},
    isSending: false,
    isAborted: false,
    wasLastAborted: false,
    isMockMode: false,
    currentLoaderId: null,
    charBlurTimer: null,
    savedTimer: null,
    uiScale: parseInt(localStorage.getItem('uiScale') || '100'),
    accentName: localStorage.getItem('accentName') || 'indigo',
    codeTheme: localStorage.getItem('codeTheme') || 'atom-one-dark',
    language: localStorage.getItem('language') || 'en',
    lastUserPrompt: '',
};

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
    },
    deleteLastResponse: async (chatId) => {
        if (window.go?.bindings?.App?.DeleteLastResponse) {
            return await window.go.bindings.App.DeleteLastResponse(chatId);
        }
        console.warn('[Wails] Running in mock mode for DeleteLastResponse');
        return true;
    },
    regenerateResponse: async (chatId, prompt) => {
        if (state.isMockMode) {
            await new Promise((res) => setTimeout(res, 1000));
            const randomIndex = Math.floor(Math.random() * mockResponses.length);
            return mockResponses[randomIndex];
        }
        if (window.go?.bindings?.App?.RegenerateResponse) {
            return await window.go.bindings.App.RegenerateResponse(chatId, prompt);
        }
        console.warn('[Wails] Running in mock mode for RegenerateResponse');
        await new Promise((res) => setTimeout(res, 1500));
        return `Это тестовый регенерированный ответ от **ИИ** (без Go-бэкенда).`;
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
    starredMessagesList: document.getElementById('starred-messages-list'),

    settingsModal: document.getElementById('settings-modal'),
    btnCloseSettingsModal: document.getElementById('btn-close-settings-modal'),
    tabBtnAppearance: document.getElementById('tab-btn-appearance'),
    tabBtnShortcuts: document.getElementById('tab-btn-shortcuts'),
    tabContentAppearance: document.getElementById('tab-content-appearance'),
    tabContentShortcuts: document.getElementById('tab-content-shortcuts'),
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
    btnScrollBottom: document.getElementById('btn-scroll-bottom'),
    emptyState: document.getElementById('empty-state'),
    messageForm: document.getElementById('message-form'),
    messageInput: document.getElementById('message-input'),
    charCounter: document.getElementById('char-counter'),
    btnSend: document.getElementById('btn-send'),

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
        DOM.toast.classList.add('translate-y-20', 'opacity-0');
    }, duration);
}

function t(key) {
    return locales[state.language]?.[key] || locales.en[key] || key;
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
        const key = el.dataset.i18nTitle;
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

window.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;

    if (e.key === 'Escape') {
        if (DOM.searchChatInput && DOM.searchChatInput.value) {
            DOM.searchChatInput.value = '';
            state.searchQuery = '';
            renderChatList();
            DOM.searchChatInput.blur();
        }
        DOM.exportModal.classList.add('hidden');
        DOM.starredModal.classList.add('hidden');
        DOM.settingsModal.classList.add('hidden');
        DOM.deleteChatModal.classList.add('hidden');
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

if (DOM.tabBtnAppearance && DOM.tabBtnShortcuts) {
    DOM.tabBtnAppearance.addEventListener('click', () => {
        DOM.tabBtnAppearance.className = 'px-4 py-1.5 text-accent border-b-2 border-accent font-semibold transition-colors';
        DOM.tabBtnShortcuts.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabContentAppearance.classList.remove('hidden');
        DOM.tabContentShortcuts.classList.add('hidden');
    });

    DOM.tabBtnShortcuts.addEventListener('click', () => {
        DOM.tabBtnShortcuts.className = 'px-4 py-1.5 text-accent border-b-2 border-accent font-semibold transition-colors';
        DOM.tabBtnAppearance.className = 'px-4 py-1.5 text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-colors';
        DOM.tabContentShortcuts.classList.remove('hidden');
        DOM.tabContentAppearance.classList.add('hidden');
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

DOM.btnToggleSidebar.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('collapsed');
});

DOM.mockModeToggle.addEventListener('change', (e) => {
    state.isMockMode = e.target.checked;
    if (state.isMockMode) {
        showToast(t('mockEnabled'), 'info');
    } else {
        showToast(t('mockDisabled'), 'info');
    }
});

DOM.searchChatInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    renderChatList();
});

function updateChatProgress() {
    const scrollHeight = DOM.messagesContainer.scrollHeight - DOM.messagesContainer.clientHeight;
    const pct = scrollHeight > 0 ? (DOM.messagesContainer.scrollTop / scrollHeight) * 100 : 0;

    const progressBar = document.getElementById('active-chat-progress');
    if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }
}

DOM.messagesContainer.addEventListener('scroll', () => {
    updateChatProgress();

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

DOM.btnStarredModal.addEventListener('click', () => {
    renderStarredMessages();
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

function toggleStarMessage(msgObj) {
    const idx = state.starredMessages.findIndex(s => s.id === msgObj.id);
    if (idx > -1) {
        state.starredMessages.splice(idx, 1);
        showToast(t('starredRemoved'), 'info');
    } else {
        state.starredMessages.push(msgObj);
        showToast(t('starredAdded'), 'info');
    }
    localStorage.setItem('starredMessages', JSON.stringify(state.starredMessages));
}

function renderStarredMessages() {
    DOM.starredMessagesList.innerHTML = '';
    if (state.starredMessages.length === 0) {
        DOM.starredMessagesList.innerHTML = `<div class="text-center text-zinc-500 py-8 text-xs">${t('noStarred')}</div>`;
        return;
    }

    state.starredMessages.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs text-zinc-200 select-text';
        div.innerHTML = `
      <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono border-b border-zinc-800/60 pb-1.5">
        <span>${item.chatTitle || 'Chat'}</span>
        <span>${formatMessageTime(item.createdAt)}</span>
      </div>
      <div class="markdown-body">${marked.parse(item.content)}</div>
      <div class="flex items-center justify-end gap-1 pt-1 border-t border-zinc-800/40">
        <button class="btn-copy-star-text p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="${t('copyText')}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>
        </button>
        <button class="btn-unstar-item p-1.5 text-amber-400 hover:text-rose-400 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center" title="Remove Bookmark">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        </button>
      </div>
    `;

        div.querySelector('.btn-copy-star-text').onclick = async function() {
            try {
                await navigator.clipboard.writeText(item.content);
                const originalHTML = this.innerHTML;
                this.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                console.error('Copy error:', err);
            }
        };

        div.querySelector('.btn-unstar-item').onclick = () => {
            toggleStarMessage(item);
            renderStarredMessages();
            renderChatList();
            if (state.activeChatId) {
                loadMessages(state.activeChatId);
            }
        };

        DOM.starredMessagesList.appendChild(div);
    });
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
        DOM.btnSend.disabled = !DOM.messageInput.value.trim();
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

DOM.btnLogout.addEventListener('click', () => {
    state.apiKey = null;
    state.activeChatId = null;
    state.chats = [];
    state.drafts = {};
    localStorage.removeItem('gemini_api_key');
    DOM.chatScreen.classList.add('hidden');
    DOM.authScreen.classList.remove('hidden');
    DOM.apiKeyInput.value = '';
    DOM.messageInput.value = '';
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

async function initChatApp() {
    try {
        applyLanguage(state.language);
        applyAccentColor(state.accentName);
        applyCodeTheme(state.codeTheme);
        applyUiScale();

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
    }
}

async function createNewChat(title = 'New Chat') {
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
        ${isActive ? `
          <div class="h-0.5 bg-zinc-800/80 w-full overflow-hidden rounded-full mt-0.5">
            <div id="active-chat-progress" class="h-full bg-accent transition-all duration-75" style="width: 0%;"></div>
          </div>
        ` : ''}
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

    updateChatProgress();
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

    renderChatList();

    DOM.messageInput.value = state.drafts[chatId] || '';
    DOM.messageInput.style.height = 'auto';
    if (DOM.messageInput.value) {
        DOM.messageInput.style.height = `${Math.min(DOM.messageInput.scrollHeight, 192)}px`;
    }
    DOM.btnSend.disabled = !DOM.messageInput.value.trim() || state.isSending;

    const len = DOM.messageInput.value.length;
    DOM.charCounter.textContent = `${len} ${getCharWord(len)}`;

    DOM.messageInput.focus();

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

        messages.forEach((msg, idx) => {
            const role = msg.role || msg.Role;
            const content = msg.content || msg.Content;
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
                false,
                isLastInChat
            );
        });
        scrollToBottom(false);
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

function appendMessageUI(role, content, createdAt, duration = null, isAborted = false, isTypewriter = false, isLastInChat = false) {
    if (DOM.messagesContainer.contains(DOM.emptyState)) {
        DOM.messagesContainer.removeChild(DOM.emptyState);
    }

    const isUser = role === 'user';
    const timeStr = formatMessageTime(createdAt);
    const wrapper = document.createElement('div');
    wrapper.className = `flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in mb-4`;

    const msgId = `${state.activeChatId}_${createdAt}_${content.substring(0, 20)}`;
    const isStarred = state.starredMessages.some(s => s.id === msgId);

    const currentChat = state.chats.find(c => (c.id || c.ID) === state.activeChatId);
    const chatTitle = currentChat ? (currentChat.title || currentChat.Title || 'Chat') : 'Chat';

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
        <div class="select-text relative transition-all duration-200 ${
        isUser
            ? 'bg-zinc-800 text-zinc-100 px-6 py-3.5 rounded-[28px] markdown-body markdown-user shadow-sm w-auto'
            : 'text-zinc-200 markdown-body w-full'
    }">
          <div class="markdown-text-body break-words w-full"></div>
        </div>

        <div class="flex items-center gap-1 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

    const textBody = wrapper.querySelector('.markdown-text-body');

    const finalizeMessage = () => {
        textBody.innerHTML = marked.parse(content) + renderFooter();
        processCodeBlocks(textBody);
        scrollToBottom(true);
        triggerSavedStatus();
    };

    if (isTypewriter && !isUser) {
        let idx = 0;
        const step = Math.max(2, Math.floor(content.length / 80));
        const timer = setInterval(() => {
            idx += step;
            if (idx >= content.length || state.isAborted) {
                clearInterval(timer);
                finalizeMessage();
                return;
            }
            textBody.innerHTML = marked.parse(content.substring(0, idx));
            scrollToBottom(true);
        }, 12);
    } else {
        finalizeMessage();
    }

    const copyMsgBtn = wrapper.querySelector('.btn-copy-msg');
    if (copyMsgBtn) {
        copyMsgBtn.onclick = async function() {
            try {
                await navigator.clipboard.writeText(content);
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
        starBtn.onclick = () => {
            toggleStarMessage({ id: msgId, chatId: state.activeChatId, chatTitle, content, createdAt, role });
            const nowStarred = state.starredMessages.some(s => s.id === msgId);
            starBtn.className = `btn-star-msg p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/60 transition-all rounded-full flex items-center justify-center ${nowStarred ? 'text-amber-400' : ''}`;
            const svg = starBtn.querySelector('svg');
            if (svg) svg.setAttribute('fill', nowStarred ? 'currentColor' : 'none');
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
    scrollToBottom(true);
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

async function triggerAIGeneration(prompt, isRegenerate = false) {
    const loaderId = appendLoaderUI();
    state.currentLoaderId = loaderId;
    const startTime = Date.now();

    try {
        const aiResponse = isRegenerate
            ? await AppAPI.regenerateResponse(state.activeChatId, prompt)
            : await AppAPI.sendMessageToAI(state.activeChatId, prompt);

        if (state.isAborted) {
            state.isAborted = false;
            return;
        }

        const durationMs = Date.now() - startTime;
        const duration = formatResponseTime(durationMs);

        removeLoaderUI(loaderId);
        state.currentLoaderId = null;

        appendMessageUI('assistant', aiResponse, new Date().toISOString(), duration, false, true, true);
    } catch (err) {
        if (!state.isAborted) {
            removeLoaderUI(loaderId);
            state.currentLoaderId = null;
            showToast(t('aiError'), 'error');
            console.error(err);
        }
    } finally {
        state.isSending = false;
        state.currentLoaderId = null;
        updateSendButtonUI();
    }
}

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
        showToast(t('genStopped'), 'info');
        return;
    }

    const text = DOM.messageInput.value.trim();
    if (!text || !state.activeChatId) return;

    delete state.drafts[state.activeChatId];
    DOM.messageInput.value = '';
    DOM.messageInput.style.height = 'auto';

    DOM.charCounter.textContent = `0 ${t('charCount')}`;

    state.isSending = true;
    state.isAborted = false;
    state.wasLastAborted = false;
    state.lastUserPrompt = text;
    updateSendButtonUI();

    appendMessageUI('user', text, new Date().toISOString(), null, false, false, false);

    await triggerAIGeneration(text);
}

autoLoginWithSavedKey();