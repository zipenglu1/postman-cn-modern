export const KNOWN_UI_TRANSLATIONS = [
  { source: 'All Workspaces', target: '所有工作区' },
  { source: 'Project workspaces', target: '项目工作区' },
  { source: 'External workspaces', target: '外部工作区' },
  { source: 'Search workspaces...', target: '搜索工作区...' },
  { source: 'Workspace name', target: '工作区名称' },
  { source: 'Owned By', target: '所有者' },
  { source: 'Last updated', target: '最后更新' },
  { source: 'Waiting for the crew... No connections yet!', target: '正在等待成员加入... 还没有连接！' },
  {
    source: 'When you are invited to join external workspaces by your partners, they will appear here, ready for you to explore and collaborate.',
    target: '当合作伙伴邀请你加入外部工作区时，它们会显示在这里，方便你浏览和协作。'
  },
  { source: 'A directory of all workspaces in', target: '你可访问的', runtimeStrategy: 'phrase' },
  { source: 'you can access.', target: '中的所有工作区目录。', runtimeStrategy: 'phrase' },
  { source: 'Create workspace', target: '创建工作区' },
  { source: 'Go back', target: '返回' },
  { source: 'Back', target: '返回' },
  { source: 'Specs', target: '规范' },
  { source: 'Apply theme', target: '应用主题' },
  { source: 'Change', target: '更改' },
  { source: 'Connect Git', target: '连接 Git' },
  { source: 'Manage People', target: '管理人员' },
  { source: 'Reset to default', target: '重置为默认' },
  { source: 'Search tabs', target: '搜索标签页' },
  { source: 'Vault', target: '保险库' },
  { source: 'Tools', target: '工具' },
  { source: 'Accent color', target: '强调色' },
  { source: 'AI credits', target: 'AI 额度' },
  { source: 'Apps', target: '应用' },
  { source: 'Breadcrumb navigation', target: '面包屑导航' },
  { source: 'Build and test APIs within your team.', target: '在你的团队中构建和测试 API。' },
  { source: 'Color for buttons and highlights.', target: '按钮和高亮颜色。' },
  { source: 'Create new request', target: '新建请求' },
  {
    source: 'Customize which panels appear in the sidebar for everyone in this workspace.',
    target: '自定义此工作区中所有人的侧边栏面板。'
  },
  { source: 'Edit workspace details', target: '编辑工作区详情' },
  { source: 'Manage workspace members', target: '管理工作区成员' },
  { source: 'Sidebar panels', target: '侧边栏面板' },
  { source: 'Workspace theme', target: '工作区主题' },
  { source: 'Workspace type', target: '工作区类型' },
  { source: 'Internal', target: '内部' },
  {
    source: "Make the workspace unique by having its theme reflect its content and your team's identity. These changes will reflect for all your members.",
    target: '通过让主题体现工作区内容和团队标识，让工作区更具辨识度。这些更改会对所有成员生效。'
  },
  {
    source: "Make the workspace unique by having its theme reflect its content and your team's identity.",
    target: '通过让主题体现工作区内容和团队标识，让工作区更具辨识度。',
    runtimeStrategy: 'phrase'
  },
  {
    source: 'These changes will reflect for all your members.',
    target: '这些更改会对所有成员生效。',
    runtimeStrategy: 'phrase'
  },
  { source: 'Theme color', target: '主题颜色' },
  { source: 'No color chosen', target: '未选择颜色' },
  { source: 'Expand', target: '展开' },
  { source: 'Filter panels', target: '筛选面板' },
  { source: 'Go back (Alt+Left arrow)', target: '返回（Alt+左方向键）' },
  { source: 'Go forward (Alt+Right arrow)', target: '前进（Alt+右方向键）' },
  { source: 'Input field', target: '输入框' },
  { source: 'Items', target: '项目' },
  { source: 'Local Files', target: '本地文件' },
  { source: 'Maximize', target: '最大化' },
  { source: 'Minimize', target: '最小化' },
  { source: 'More workspace actions', target: '更多工作区操作' },
  { source: 'Navigation menu', target: '导航菜单' },
  { source: 'Open search', target: '打开搜索' },
  { source: 'Overall interface color.', target: '整体界面颜色。' },
  { source: 'Select environment', target: '选择环境' },
  { source: 'Star workspace', target: '星标工作区' },
  { source: 'Toolbar', target: '工具栏' },
  { source: 'New Chat', target: '新建聊天' },
  { source: 'Start using Agent Mode!', target: '开始使用 Agent 模式！' },
  { source: 'Your plan includes', target: '你的方案包含' },
  { source: 'per month to use Agent Mode.', target: '每月可使用 Agent 模式。' },
  {
    source: 'Describe what you need. Press @ for context, / for Skills.',
    target: '描述你需要什么。按 @ 添加上下文，按 / 使用技能。'
  },
  { source: "'s Workspace", target: '的工作区', runtimeStrategy: 'phrase' },
  { source: 'profile picture', target: '头像', runtimeStrategy: 'phrase' },
  { source: 'Get data', target: '获取数据' },
  { source: 'Post an Update', target: '发布更新' },
  { source: 'Write with AI', target: '使用 AI 编写' },
  { source: 'Account settings', target: '账户设置' },
  { source: 'App settings', target: '应用设置' },
  { source: 'Team settings', target: '团队设置' },
  { source: 'Request History', target: '请求历史' },
  { source: 'Keep people informed about your work', target: '让成员了解你的工作' },
  {
    source: 'Share important announcements and communicate API changes directly from your workspace.',
    target: '从你的工作区直接分享重要公告并沟通 API 变更。'
  },
  { source: 'Pin collections', target: '固定集合' },
  {
    source: 'Add a summary to outline the purpose of this workspace.',
    target: '添加摘要以说明此工作区的用途。'
  },
  {
    source: 'Help people understand your workspace by adding a description...',
    target: '通过添加描述帮助他人了解你的工作区...'
  },
  { source: 'Visit app marketplace', target: '访问应用市场' },
  {
    source: 'Postman integrates with essential tools across the software development pipeline to enable API-first practices and streamline critical workflows.',
    target: 'Postman 可与软件开发流程中的关键工具集成，以支持 API 优先实践并简化关键工作流。'
  },
  {
    source: "Search for apps in Postman's app marketplace and request apps to be installed by your team's admin.",
    target: '在 Postman 应用市场中搜索应用，并请求团队管理员安装应用。'
  },
  {
    source: 'Streamline workflows with the developer tools you already use',
    target: '使用你已在用的开发工具简化工作流'
  },
  { source: 'No items in this panel', target: '此面板中没有项目' },
  { source: 'Open Postman on web', target: '在网页中打开 Postman' },
  { source: 'Always open sidebar item in new tab', target: '始终在新标签页中打开侧边栏项目' },
  { source: 'Application', target: '应用程序' },
  {
    source: 'Automatically open links in desktop app when possible. You can update your preference in the Settings of Postman in your browser.',
    target: '尽可能自动在桌面应用中打开链接。你可以在浏览器版 Postman 的设置中更新此偏好。'
  },
  { source: 'Autosave', target: '自动保存' },
  { source: 'Autosave changes to your requests.', target: '自动保存请求的更改。' },
  {
    source: 'Choose the language for the Postman app and email notifications.',
    target: '选择 Postman 应用和电子邮件通知使用的语言。'
  },
  { source: 'Close modal', target: '关闭弹窗' },
  {
    source: 'Collaborate on files used in requests by sharing your working directory. Learn how to',
    target: '通过共享工作目录协作处理请求中使用的文件。了解如何'
  },
  { source: 'Default documentation editor', target: '默认文档编辑器' },
  { source: 'Disable cookie jar for all requests.', target: '对所有请求禁用 Cookie 罐。' },
  { source: 'Disable cookies', target: '禁用 Cookie' },
  {
    source: 'Enable SSL/TLS session key logging for debugging encrypted connections',
    target: '启用 SSL/TLS 会话密钥日志以调试加密连接'
  },
  { source: 'English', target: '英语' },
  { source: 'HTTP version', target: 'HTTP 版本' },
  { source: 'Markdown editor', target: 'Markdown 编辑器' },
  { source: 'Max response size', target: '最大响应大小' },
  { source: 'Modal', target: '弹窗' },
  { source: 'Open in desktop app', target: '在桌面应用中打开' },
  { source: 'Read files outside working directory', target: '读取工作目录之外的文件' },
  { source: 'Response format detection', target: '响应格式检测' },
  {
    source: 'Select the HTTP version to use for sending the request.',
    target: '选择用于发送请求的 HTTP 版本。'
  },
  { source: 'setup your working directory', target: '设置你的工作目录' },
  { source: 'Show middle workbench', target: '显示中间工作台' },
  { source: 'SSL/TLS key log', target: 'SSL/TLS 密钥日志' },
  { source: 'Swap left and right sidebars', target: '交换左右侧边栏' },
  { source: 'Github Issues', target: 'GitHub 问题' },
  { source: 'Keyboard shortcuts', target: '快捷键' },
  { source: 'Submenu', target: '子菜单' },
  { source: 'Trust and Security', target: '信任与安全' },
  { source: 'Active when system is set to dark.', target: '系统设置为深色时启用。' },
  { source: 'Active when system is set to light.', target: '系统设置为浅色时启用。' },
  { source: 'Day Theme', target: '日间主题' },
  { source: 'Night Theme', target: '夜间主题' },
  {
    source: 'Personalize your experience with themes that match your style. Manually select a theme or sync with system settings and let the machine set your day and night themes.',
    target: '使用与你风格匹配的主题个性化体验。你可以手动选择主题，或与系统设置同步，让系统自动设置日间和夜间主题。'
  },
  { source: 'Sync with system', target: '与系统同步' },
  { source: 'Theme selection', target: '主题选择' },
  { source: 'Restore Defaults', target: '恢复默认值' },
  { source: 'Accept All', target: '全部接受' },
  { source: 'Cancel Conversation', target: '取消对话' },
  { source: 'Collapse All', target: '全部折叠' },
  { source: 'Environment Selector', target: '环境选择器' },
  { source: 'Expand All', target: '全部展开' },
  { source: 'Open Agent Mode', target: '打开 Agent 模式' },
  { source: 'Open Vault', target: '打开保险库' },
  { source: 'Reject All', target: '全部拒绝' },
  { source: 'Reset Layout', target: '重置布局' },
  { source: 'Search in Current Workspace', target: '在当前工作区中搜索' },
  { source: 'Search Tabs', target: '搜索标签页' },
  { source: 'Send Request with AI', target: '使用 AI 发送请求' },
  { source: 'Show/Hide Console', target: '显示/隐藏控制台' },
  { source: 'Swap Sidebars', target: '交换侧边栏' },
  { source: 'through', target: '到' },
  { source: 'Toggle Left Sidebar', target: '切换左侧边栏' },
  { source: 'Toggle Right Sidebar', target: '切换右侧边栏' },
  { source: 'Toggle Workbench', target: '切换工作台' },
  { source: 'Window and modals', target: '窗口和弹窗' },
  { source: 'Export Scratch Pad Data', target: '导出 Scratch Pad 数据' },
  { source: 'Import Data File', target: '导入数据文件' },
  { source: 'Migrate Data', target: '迁移数据' },
  {
    source: 'Export all your scratch Pad data into a single dump file.',
    target: '将所有 Scratch Pad 数据导出为一个转储文件。'
  },
  { source: 'Export Scratch Pad data', target: '导出 Scratch Pad 数据' },
  {
    source: 'Migrate and sync all your Scratch Pad data to a workspace.',
    target: '将所有 Scratch Pad 数据迁移并同步到工作区。'
  },
  { source: 'Migrate Scratch Pad data', target: '迁移 Scratch Pad 数据' },
  { source: 'Scratch Pad Data', target: 'Scratch Pad 数据' },
  { source: 'Install in terminal', target: '在终端中安装' },
  {
    source: 'Bring the power of Postman to your command line. Run collections, automate tests, and integrate with CI/CD workflows.',
    target: '将 Postman 的能力带到命令行。运行集合、自动化测试，并集成 CI/CD 工作流。'
  },
  {
    source: 'Capture and sync cookies and requests directly from your browser to Postman. Use it to test authenticated APIs and debug browser-based workflows seamlessly.',
    target: '从浏览器直接捕获并同步 Cookie 和请求到 Postman。用它测试已认证的 API，并顺畅调试基于浏览器的工作流。'
  },
  { source: 'Download from npm', target: '从 npm 下载' },
  { source: 'Install on Chrome', target: '安装到 Chrome' },
  { source: 'Install on VS Code', target: '安装到 VS Code' },
  { source: 'Postman CLI', target: 'Postman CLI' },
  { source: 'Postman Interceptor', target: 'Postman Interceptor' },
  { source: 'Postman VS Code Extension', target: 'Postman VS Code 扩展' },
  {
    source: 'Send requests, test APIs, and manage collections — all from within your code editor. Also available for Cursor, Windsurf, and other compatible editors.',
    target: '在代码编辑器中发送请求、测试 API、管理集合。也支持 Cursor、Windsurf 和其他兼容编辑器。'
  },
  { source: 'Add Certificate…', target: '添加证书...' },
  {
    source: 'Add and manage SSL certificates on a per domain basis. Learn more about',
    target: '按域名添加和管理 SSL 证书。了解更多关于'
  },
  { source: 'working with certificates', target: '使用证书' },
  {
    source: 'Postman uses the system’s proxy configurations by default to connect to any online services, or to send API requests.',
    target: 'Postman 默认使用系统代理配置连接在线服务或发送 API 请求。'
  },
  {
    source: 'Respect HTTP_PROXY, HTTPS_PROXY, and NO_PROXY environment variables',
    target: '遵循 HTTP_PROXY、HTTPS_PROXY 和 NO_PROXY 环境变量'
  },
  {
    source: 'Specify a proxy setting to act as an intermediary for requests sent through the Builder in Postman. These configurations do not apply to any Postman services. Learn more about',
    target: '指定代理设置，作为 Postman Builder 发送请求的中介。这些配置不适用于任何 Postman 服务。了解更多关于'
  },
  { source: 'Use custom proxy configuration', target: '使用自定义代理配置' },
  { source: 'using a custom proxy', target: '使用自定义代理' },
  { source: 'Architecture', target: '架构' },
  { source: 'Desktop platform version', target: '桌面平台版本' },
  { source: 'OS platform', target: '操作系统平台' },
  { source: 'Postman for Windows', target: 'Postman Windows 版' },
  { source: 'Privacy', target: '隐私' },
  { source: 'UI version', target: 'UI 版本' },
  { source: 'Twitter', target: 'Twitter' },
  { source: 'Send + Get a successful response', target: '发送并获取成功响应' },
  { source: 'Send + Visualize response', target: '发送并可视化响应' },
  { source: 'Send + Write tests', target: '发送并编写测试' },
  { source: 'button', target: '按钮' },
  { source: 'Button group', target: '按钮组' },
  { source: 'Open dropdown', target: '打开下拉菜单' },
  { source: 'search', target: '搜索' },
  { source: 'Send options', target: '发送选项' },
  { source: 'Switch request type', target: '切换请求类型' },
  { source: 'Document this request...', target: '为此请求编写文档...' }
];

export function summarizeUntranslatedItems(items, dictionaryEntries = []) {
  const knownSources = new Set(dictionaryEntries.map((entry) => entry.source));
  const candidates = new Map();

  for (const item of items) {
    const text = normalizeVisibleText(item.text);
    if (!isCandidateText(text)) continue;
    if (knownSources.has(text)) continue;

    const current = candidates.get(text) ?? {
      text,
      count: 0,
      kinds: new Set(),
      samples: []
    };
    current.count += 1;
    current.kinds.add(item.kind ?? 'text');
    if (current.samples.length < 3) {
      current.samples.push({
        kind: item.kind ?? 'text',
        tag: item.tag ?? null,
        selector: item.selector ?? null
      });
    }
    candidates.set(text, current);
  }

  return [...candidates.values()]
    .map((candidate) => ({
      ...candidate,
      kinds: [...candidate.kinds],
      knownTranslation: findKnownTranslation(candidate.text)
    }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
}

export function knownTranslationsForTexts(texts) {
  const visible = new Set(texts.map(normalizeVisibleText));
  return KNOWN_UI_TRANSLATIONS.filter((entry) => {
    if (visible.has(entry.source)) return true;
    return entry.runtimeStrategy === 'phrase' && [...visible].some((text) => text.includes(entry.source));
  });
}

export function mergeManualEntries(manualDictionary, entries) {
  const existing = new Set(manualDictionary.entries.map((entry) => entry.source));
  const added = [];

  for (const entry of entries) {
    if (existing.has(entry.source)) continue;
    const next = {
      source: entry.source,
      target: entry.target,
      match: 'literal'
    };
    if (entry.runtimeStrategy) next.runtimeStrategy = entry.runtimeStrategy;
    manualDictionary.entries.push(next);
    existing.add(entry.source);
    added.push(next);
  }

  return added;
}

export function normalizeVisibleText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function findKnownTranslation(text) {
  return KNOWN_UI_TRANSLATIONS.find((entry) => entry.source === text) ?? null;
}

function isCandidateText(text) {
  if (!text || text.length < 2 || text.length > 220) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (isMostlyLocalizedMixedText(text)) return false;
  if (/https?:\/\/|^wss?:\/\//i.test(text)) return false;
  if (/^[A-Z0-9_-]{16,}$/.test(text)) return false;
  if (/^[{}[\](),.;:+*/\\|<>=!?'"` -]+$/.test(text)) return false;
  if (/^[\w.-]+@[\w.-]+$/.test(text)) return false;
  if (/^@[\w-]+$/.test(text)) return false;
  if (/^\d+(\.\d+)?\s*(ms|s|KB|MB|GB)?$/i.test(text)) return false;
  if (/^(ms|px)$/i.test(text)) return false;
  if (/^\d{1,2}:\d{2}\s*(AM|PM),\s*[A-Z][a-z]+\s+\d{1,2},\s+\d{4}$/.test(text)) return false;
  if (/^(Ctrl|Alt|Shift|Enter|Esc|Tab|Cmd|Del|⌘|⌥|⇧|⌃)[,+\w -]*$/i.test(text)) return false;
  if (/^Claude\s+\w+\s+\d+(\.\d+)?$/i.test(text)) return false;
  if (/^\d+\.\d+\.\d+[-\w]*$/i.test(text)) return false;
  if (/^(win32|darwin|linux)\s+\d+(\.\d+)*$/i.test(text)) return false;
  if (/^x64|arm64$/i.test(text)) return false;
  if (/^[A-Z]{2,8}$/.test(text)) return false;
  return true;
}

function isMostlyLocalizedMixedText(text) {
  if (!/[\u3400-\u9fff]/.test(text)) return false;
  const englishWords = text.match(/[A-Za-z][A-Za-z.-]*/g) ?? [];
  if (englishWords.length === 0) return false;
  const allowedMixedWords = new Set([
    'AI',
    'API',
    'Agent',
    'Alt',
    'Cookie',
    'Ctrl',
    'Git',
    'GitHub',
    'HTTP',
    'HTTPS',
    'URL',
    'CA',
    'Builder',
    'CD',
    'CI',
    'Chrome',
    'Code',
    'Cursor',
    'NO',
    'PROXY',
    'Pad',
    'Scratch',
    'Markdown',
    'Postman',
    'SSL',
    'TLS',
    'Tab',
    'Token',
    'UI',
    'no-cache',
    'npm',
    'VS',
    'Windows',
    'Windsurf',
    'px'
  ]);
  return englishWords.every((word) => allowedMixedWords.has(word));
}
