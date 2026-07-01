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
  { source: 'Document this request...', target: '为此请求编写文档...' },
  { source: 'Errors', target: '错误' },
  { source: 'New Run', target: '新建运行' },
  { source: 'View all runs', target: '查看所有运行' },
  { source: 'Collapse', target: '折叠' },
  { source: 'Avg. Resp. Time', target: '平均响应时间' },
  { source: 'Console log', target: '控制台日志' },
  { source: 'Duration', target: '持续时间' },
  { source: 'Iteration', target: '迭代', runtimeStrategy: 'phrase' },
  { source: 'Run actions', target: '运行操作' },
  { source: "This response doesn't have a body.", target: '此响应没有正文。' },
  { source: 'Ran on', target: '运行于', runtimeStrategy: 'phrase' },
  { source: 'Run results', target: '运行结果', runtimeStrategy: 'phrase' },
  { source: 'Local Vault', target: '本地保险库' },
  { source: 'Locally store secrets in vault', target: '在保险库中本地存储密钥' },
  { source: 'Save this key to native password manager', target: '将此密钥保存到系统密码管理器' },
  { source: 'Save your vault key', target: '保存你的保险库密钥' },
  {
    source: 'This unique key for your account will be needed when you sign out and sign in. Losing the key will result in the loss of all your secrets. Vault secrets can\'t be accessed when logged out.',
    target: '此唯一密钥在退出登录和重新登录时需要使用。丢失密钥将导致所有密钥丢失。保险库密钥在退出登录后无法访问。'
  },
  {
    source: 'This will make your vault access seamless every time you sign in.',
    target: '这将使你每次登录时都能无缝访问保险库。'
  },
  {
    source: 'Use vault secrets across workspaces in requests, test scripts, authorizations, environments, etc., using',
    target: '在请求、测试脚本、授权、环境等中跨工作区使用保险库密钥，使用'
  },
  { source: 'Browser', target: '浏览器' },
  { source: 'Find and replace', target: '查找和替换' },
  { source: 'Filter secrets', target: '筛选密钥' },
  { source: 'Add new secret', target: '新建密钥' },
  { source: 'Allowed domains', target: '允许的域' },
  {
    source: 'Store sensitive data locally. Local Vault secrets work across workspaces, are only accessible to you, remain on your device, and are never synced.',
    target: '在本地存储敏感数据。本地保险库密钥可跨工作区使用，仅你可访问，保留在设备上且永远不会同步。'
  },
  // --- Proxy panel ---
  { source: 'Start proxy session', target: '启动代理会话' },
  { source: 'New proxy session', target: '新建代理会话' },
  { source: 'Browser traffic', target: '浏览器流量' },
  { source: 'System traffic', target: '系统流量' },
  { source: 'Capture HTTPS traffic', target: '捕获 HTTPS 流量' },
  {
    source: 'Capture and inspect app traffic on your devices.',
    target: '在你的设备上捕获并检查应用流量。'
  },
  {
    source: "To capture and inspect traffic on your browser, download Postman's interceptor extension.",
    target: '要捕获和检查浏览器流量，请下载 Postman Interceptor 扩展。'
  },
  {
    source: "Use Postman's proxy to inspect HTTPS communication from your Android, iOS, Linux, macOS, and Windows devices and build client-side applications faster!",
    target: '使用 Postman 代理检查来自 Android、iOS、Linux、macOS 和 Windows 设备的 HTTPS 通信，更快地构建客户端应用！'
  },
  {
    source: "We'll request to install certificate the first time you start a proxy session.",
    target: '首次启动代理会话时，我们将请求安装证书。'
  },
  { source: 'Port :', target: '端口：' },
  { source: 'App store', target: '应用商店' },
  { source: 'Chrome store', target: 'Chrome 商店' },
  { source: 'Edge Add-ons', target: 'Edge 扩展' },
  { source: 'Mozilla Add-ons', target: 'Mozilla 扩展' },
  // --- Variables / Vault panel ---
  { source: 'Add secrets', target: '添加密钥' },
  { source: 'All variables', target: '所有变量' },
  { source: 'No global variables in this workspace.', target: '此工作区中没有全局变量。' },
  { source: 'No vault secrets defined.', target: '未定义保险库密钥。' },
  // --- Command palette ---
  { source: 'RECENTLY VIEWED', target: '最近查看' },
  { source: 'Show and run commands', target: '显示并运行命令' },
  { source: 'Type filter. Click to apply filter', target: '输入筛选条件。点击应用筛选' },
  { source: 'Visibility filter. Click to apply filter', target: '可见性筛选。点击应用筛选' },
  { source: 'Find in', target: '在其中查找' },
  { source: 'New flow', target: '新建流程' },
  // --- Profile / misc ---
  { source: 'By', target: '作者' },
  { source: 'In', target: '位置' },
  // --- Notification ---
  { source: "You're all caught up", target: '已全部查看', runtimeStrategy: 'phrase' },
  { source: 'Get notified on Slack →', target: '在 Slack 上获取通知 →' },
  { source: 'Direct', target: '直接连接' },
  { source: 'Open folder', target: '打开文件夹' },
  // --- Cookie panel ---
  { source: 'Clear all cookies', target: '清除所有 Cookie' },
  { source: 'Domains allowlist', target: '域名白名单' },
  { source: 'Add cookie', target: '添加 Cookie' },
  { source: 'cookies', target: 'Cookie' },
  { source: 'Manage Cookies', target: '管理 Cookie' },
  { source: 'Sync Cookies', target: '同步 Cookie' },
  // --- Runner results ---
  { source: 'Retry run', target: '重新运行' },
  {
    source: 'Request and response details are saved only for the current session. Run the collection again to view this response.',
    target: '请求和响应详情仅在当前会话中保存。请重新运行集合以查看此响应。'
  },
  { source: 'Response is no longer available', target: '响应已不可用' },
  // --- Git integration ---
  {
    source: 'Postman updates collections, specs and environments, and follows git branches. Push to cloud when ready.',
    target: 'Postman 更新集合、规范和环境，并跟踪 Git 分支。准备好后可推送到云端。'
  },
  { source: 'Work with your local codebase', target: '使用本地代码库' },
  // --- Errors ---
  { source: 'Failed to fetch', target: '获取失败' },
  // --- View toggle ---
  { source: 'Grid', target: '网格' },
  { source: 'vault', target: '保险库', runtimeStrategy: 'phrase' },
  // --- Electron native menu (main.js only) ---
  // File menu
  { source: 'New...', target: '新建...', files: ['main.js'] },
  { source: 'New Tab', target: '新建标签页', files: ['main.js'] },
  { source: 'New Runner Tab', target: '新建运行器标签页', files: ['main.js'] },
  { source: 'New Postman Window', target: '新建 Postman 窗口', files: ['main.js'] },
  { source: 'Import...', target: '导入...', files: ['main.js'] },
  { source: 'Close Window', target: '关闭窗口', files: ['main.js'] },
  { source: 'Close Tab', target: '关闭标签页', files: ['main.js'] },
  { source: 'Force Close Tab', target: '强制关闭标签页', files: ['main.js'] },
  { source: 'File', target: '文件', files: ['main.js'] },
  { source: 'Exit', target: '退出', files: ['main.js'] },
  { source: 'Quit', target: '退出', files: ['main.js'] },
  // Edit menu
  { source: 'Edit', target: '编辑', files: ['main.js'] },
  { source: 'Undo', target: '撤销', files: ['main.js'] },
  { source: 'Redo', target: '重做', files: ['main.js'] },
  { source: 'Paste and Match Style', target: '粘贴并匹配样式', files: ['main.js'] },
  { source: 'Select All', target: '全选', files: ['main.js'] },
  // View menu
  { source: 'View', target: '视图', files: ['main.js'] },
  { source: 'Toggle Full Screen', target: '切换全屏', files: ['main.js'] },
  { source: 'Zoom In', target: '放大', files: ['main.js'] },
  { source: 'Zoom Out', target: '缩小', files: ['main.js'] },
  { source: 'Reset Zoom', target: '重置缩放', files: ['main.js'] },
  { source: 'Toggle Sidebar', target: '切换侧边栏', files: ['main.js'] },
  { source: 'Toggle Two-Pane View', target: '切换双栏视图', files: ['main.js'] },
  { source: 'Show Postman Console', target: '显示 Postman 控制台', files: ['main.js'] },
  { source: 'Toggle Left Sidebar', target: '切换左侧边栏', files: ['main.js'] },
  { source: 'Toggle Workbench', target: '切换工作台', files: ['main.js'] },
  { source: 'Toggle Right Sidebar', target: '切换右侧边栏', files: ['main.js'] },
  { source: 'Swap Left and Right Sidebar', target: '交换左右侧边栏', files: ['main.js'] },
  { source: 'Reset Layout', target: '重置布局', files: ['main.js'] },
  { source: 'Developer', target: '开发者', files: ['main.js'] },
  { source: 'Show DevTools (Current View)', target: '显示开发者工具（当前视图）', files: ['main.js'] },
  { source: 'View Logs in Finder', target: '在访达中查看日志', files: ['main.js'] },
  { source: 'View Logs in Explorer', target: '在资源管理器中查看日志', files: ['main.js'] },
  { source: 'View Logs in File Manager', target: '在文件管理器中查看日志', files: ['main.js'] },
  // Window menu
  { source: 'Window', target: '窗口', files: ['main.js'] },
  { source: 'Go Back', target: '返回', files: ['main.js'] },
  { source: 'Go Forward', target: '前进', files: ['main.js'] },
  { source: 'Next Tab', target: '下一个标签页', files: ['main.js'] },
  { source: 'Previous Tab', target: '上一个标签页', files: ['main.js'] },
  { source: 'Bring All to Front', target: '全部置于最前', files: ['main.js'] },
  // Help menu
  { source: 'Help', target: '帮助', files: ['main.js'] },
  { source: 'Setup Web Gateway Support', target: '设置 Web 网关支持', files: ['main.js'] },
  { source: 'Clear Cache and Reload', target: '清除缓存并重新加载', files: ['main.js'] },
  { source: 'Check for Updates', target: '检查更新', files: ['main.js'] },
  { source: 'Check for Updates...', target: '检查更新...', files: ['main.js'] },
  // macOS app menu
  { source: 'Preferences', target: '偏好设置', files: ['main.js'] },
  { source: 'Services', target: '服务', files: ['main.js'] },
  { source: 'Hide Others', target: '隐藏其他', files: ['main.js'] },
  { source: 'Show All', target: '全部显示', files: ['main.js'] },
  // Dock menu
  { source: 'New Window', target: '新建窗口', files: ['main.js'] },
  // GPU
  { source: 'Disable Hardware Acceleration', target: '禁用硬件加速', files: ['main.js'] },
  { source: 'Enable Hardware Acceleration', target: '启用硬件加速', files: ['main.js'] },
  {
    source: 'You are about to enable hardware acceleration. The application needs to be restarted for this change to take effect.',
    target: '你即将启用硬件加速。此更改需要重新启动应用程序才能生效。',
    files: ['main.js']
  },
  { source: 'Enabling Hardware Acceleration', target: '正在启用硬件加速', files: ['main.js'] },
  {
    source: 'You are about to disable hardware acceleration. The application needs to be restarted for this change to take effect.',
    target: '你即将禁用硬件加速。此更改需要重新启动应用程序才能生效。',
    files: ['main.js']
  },
  { source: 'Disabling Hardware Acceleration', target: '正在禁用硬件加速', files: ['main.js'] },
  { source: 'Restart', target: '重启', files: ['main.js'] },
  // Region preference
  { source: 'Region Preference for New Accounts', target: '新账户的区域偏好', files: ['main.js'] },
  { source: 'Use US Region by Default', target: '默认使用美国区域', files: ['main.js'] },
  { source: 'Use EU Region by Default', target: '默认使用欧洲区域', files: ['main.js'] },
  { source: 'Always Ask for Region Selection', target: '始终询问区域选择', files: ['main.js'] }
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
    if (entry.files) next.files = entry.files;
    manualDictionary.entries.push(next);
    existing.add(entry.source);
    added.push(next);
  }

  return added;
}

export function normalizeVisibleText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .trim();
}

function findKnownTranslation(text) {
  return KNOWN_UI_TRANSLATIONS.find((entry) => entry.source === text) ?? null;
}

function isCandidateText(text) {
  if (!text || text.length < 2 || text.length > 220) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (text === '[object Object]') return false;
  if (isMostlyLocalizedMixedText(text)) return false;
  if (/https?:\/\/|^wss?:\/\//i.test(text)) return false;
  if (/\{\{[^}]+\}\}/.test(text)) return false;
  if (/^\/[\w/{}.-]*$/.test(text)) return false;
  if (/^[A-Z0-9_-]{16,}$/.test(text)) return false;
  if (/^[{}[\](),.;:+*/\\|<>=!?'"` -]+$/.test(text)) return false;
  if (/^[\w.-]+@[\w.-]+$/.test(text)) return false;
  if (/^@[\w-]+$/.test(text)) return false;
  if (/^\d+(\.\d+)?\s*(ms|s|KB|MB|GB)?$/i.test(text)) return false;
  if (/^(ms|px)$/i.test(text)) return false;
  if (/^\d+\s*(ms|s)\s*\d+\s*(ms|s)$/i.test(text)) return false;
  if (/^\d{1,2}:\d{2}\s*(AM|PM),\s*[A-Z][a-z]+\s+\d{1,2},\s+\d{4}$/.test(text)) return false;
  if (/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(,\s+\d{4})?$/.test(text)) return false;
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
    'AI', 'API', 'Agent', 'Alt', 'Cookie', 'Ctrl', 'Git', 'GitHub',
    'HTTP', 'HTTPS', 'URL', 'CA', 'Builder', 'CD', 'CI', 'Chrome',
    'Code', 'Cursor', 'NO', 'PROXY', 'Pad', 'Scratch', 'Markdown',
    'Postman', 'SSL', 'TLS', 'Tab', 'Token', 'UI', 'no-cache', 'npm',
    'VS', 'Windows', 'Windsurf', 'px',
    'Interceptor', 'Edge', 'Mozilla', 'Android', 'iOS', 'Linux',
    'macOS', 'Slack', 'GraphQL', 'JWT', 'OAuth', 'NTLM', 'Hawk',
    'AWS', 'Akamai', 'EdgeGrid', 'Slack'
  ]);
  const allowedLower = new Set([...allowedMixedWords].map(w => w.toLowerCase()));
  return englishWords.every((word) => allowedMixedWords.has(word) || allowedLower.has(word.toLowerCase()));
}
