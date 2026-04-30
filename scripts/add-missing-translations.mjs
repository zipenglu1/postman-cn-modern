import { readFile, writeFile } from 'node:fs/promises';

const dictPath = 'dictionaries/local-core.zh-CN.json';
const dict = JSON.parse(await readFile(dictPath, 'utf8'));
const existing = new Set(dict.entries.map(e => e.source));

const newEntries = [
  // Auth types
  { source: 'Inherit', target: '继承', match: 'literal' },
  { source: 'API Key', target: 'API 密钥', match: 'literal' },
  { source: 'Bearer Token', target: 'Bearer 令牌', match: 'literal' },
  { source: 'Basic Auth', target: '基本认证', match: 'literal' },
  { source: 'JWT Token', target: 'JWT 令牌', match: 'literal' },
  { source: 'Digest Auth', target: '摘要认证', match: 'literal' },
  { source: 'No Auth', target: '无认证', match: 'literal' },
  { source: 'Hawk Authentication', target: 'Hawk 认证', match: 'literal' },
  { source: 'AWS Signature', target: 'AWS 签名', match: 'literal' },
  { source: 'NTLM Authentication', target: 'NTLM 认证', match: 'literal' },

  // Auth config
  { source: 'Add authorization data to', target: '添加授权数据到', match: 'literal' },
  { source: 'Request URL', target: '请求 URL', match: 'literal' },
  { source: 'Username', target: '用户名', match: 'literal' },
  { source: 'Password', target: '密码', match: 'literal' },
  { source: 'Show Password', target: '显示密码', match: 'literal' },
  { source: 'Prefix', target: '前缀', match: 'literal' },
  { source: 'Add to', target: '添加到', match: 'literal' },
  { source: 'Query Params', target: '查询参数', match: 'literal' },

  // Body options
  { source: 'form-data', target: '表单数据', match: 'literal' },
  { source: 'binary', target: '二进制', match: 'literal' },
  { source: 'None', target: '无', match: 'literal' },

  // Response section
  { source: 'Pretty', target: '格式化', match: 'literal' },
  { source: 'Raw', target: '原始', match: 'literal' },
  { source: 'Preview', target: '预览', match: 'literal' },
  { source: 'Visualize', target: '可视化', match: 'literal' },
  { source: 'Copy response', target: '复制响应', match: 'literal' },
  { source: 'Download response', target: '下载响应', match: 'literal' },
  { source: 'Response Headers', target: '响应头', match: 'literal' },
  { source: 'Response Body', target: '响应体', match: 'literal' },
  { source: 'Test Results', target: '测试结果', match: 'literal' },

  // Settings page - proxy
  { source: 'Proxy settings for sending requests', target: '发送请求的代理设置', match: 'literal' },
  { source: 'Use custom proxy configuration', target: '使用自定义代理配置', match: 'literal' },
  { source: 'Add a custom proxy URL that Postman will use to send requests.', target: '添加自定义代理 URL，Postman 将使用它发送请求。', match: 'literal' },
  { source: 'Add proxy URL', target: '添加代理 URL', match: 'literal' },
  { source: 'Proxy URL', target: '代理 URL', match: 'literal' },
  { source: 'Use system proxy', target: '使用系统代理', match: 'literal' },
  { source: 'Proxy bypass toggle', target: '代理绕过开关', match: 'literal' },

  // Settings page - language
  { source: 'Language', target: '语言', match: 'literal' },
  { source: 'Choose the language for the Postman app and email notifications.', target: '选择 Postman 应用和电子邮件通知使用的语言。', match: 'literal' },

  // General UI
  { source: 'Save As', target: '另存为', match: 'literal' },
  { source: 'Save as', target: '另存为', match: 'literal' },
  { source: 'Save to', target: '保存到', match: 'literal' },
  { source: 'Save Response', target: '保存响应', match: 'literal' },
  { source: 'New Collection', target: '新建集合', match: 'literal' },
  { source: 'New Folder', target: '新建文件夹', match: 'literal' },
  { source: 'New Request', target: '新建请求', match: 'literal' },
  { source: 'Duplicate Tab', target: '复制标签页', match: 'literal' },
  { source: 'Force Delete', target: '强制删除', match: 'literal' },
  { source: 'New Environment', target: '新建环境', match: 'literal' },
  { source: 'New HTTP Request', target: '新建 HTTP 请求', match: 'literal' },
  { source: 'New Collection Runner', target: '新建集合运行器', match: 'literal' },
  { source: 'New gRPC Request', target: '新建 gRPC 请求', match: 'literal' },
  { source: 'New WebSocket Request', target: '新建 WebSocket 请求', match: 'literal' },
  { source: 'New Socket.IO Request', target: '新建 Socket.IO 请求', match: 'literal' },
  { source: 'New SSE Request', target: '新建 SSE 请求', match: 'literal' },
  { source: 'New GraphQL Request', target: '新建 GraphQL 请求', match: 'literal' },
  { source: 'Toggle Two-Pane View', target: '切换双面板视图', match: 'literal' },
  { source: 'Toggle One-Pane View', target: '切换单面板视图', match: 'literal' },
  { source: 'Search', target: '搜索', match: 'literal' },
  { source: 'Find and Replace', target: '查找和替换', match: 'literal' },
  { source: 'Find', target: '查找', match: 'literal' },
  { source: 'New Tab', target: '新建标签页', match: 'literal' },
  { source: 'Close Tab', target: '关闭标签页', match: 'literal' },
  { source: 'Close Other Tabs', target: '关闭其他标签页', match: 'literal' },
  { source: 'Reopen Closed Tab', target: '重新打开已关闭的标签页', match: 'literal' },
  { source: 'Next Tab', target: '下一个标签页', match: 'literal' },
  { source: 'Previous Tab', target: '上一个标签页', match: 'literal' },
  { source: 'Zoom In', target: '放大', match: 'literal' },
  { source: 'Zoom Out', target: '缩小', match: 'literal' },
  { source: 'Reset Zoom', target: '重置缩放', match: 'literal' },
  { source: 'Toggle Full Screen', target: '切换全屏', match: 'literal' },
  { source: 'Open Settings', target: '打开设置', match: 'literal' },
  { source: 'Toggle Sidebar', target: '切换侧边栏', match: 'literal' },
  { source: 'Toggle Console', target: '切换控制台', match: 'literal' },
  { source: 'Copy', target: '复制', match: 'literal' },
  { source: 'Cut', target: '剪切', match: 'literal' },
  { source: 'Paste', target: '粘贴', match: 'literal' },
  { source: 'Select All', target: '全选', match: 'literal' },
  { source: 'Undo', target: '撤销', match: 'literal' },
  { source: 'Redo', target: '重做', match: 'literal' },
  { source: 'Rename', target: '重命名', match: 'literal' },
  { source: 'Duplicate', target: '复制', match: 'literal' },
  { source: 'Keyboard Shortcuts', target: '键盘快捷键', match: 'literal' },

  // Plus button dropdown
  { source: 'Search...', target: '搜索...', match: 'literal' },
  { source: 'Spec', target: '规范', match: 'literal' },
  { source: 'Flow', target: '流程', match: 'literal' },
  { source: 'New flow', target: '新流程', match: 'literal' },

  // History page empty state
  { source: 'No request history', target: '没有请求历史', match: 'literal' },
  { source: 'Send the request and', target: '发送请求并', match: 'literal' },
  { source: 'browse through its history.', target: '浏览其历史记录。', match: 'literal' },

  // Body type
  { source: 'raw', target: '原始', match: 'literal' },

  // Authorization page
  { source: 'This request does not use any authorization.', target: '此请求不使用任何授权。', match: 'literal' },
];

let added = 0;
for (const entry of newEntries) {
  if (existing.has(entry.source)) continue;
  dict.entries.push(entry);
  existing.add(entry.source);
  added++;
  console.log('+ ' + entry.source + ' -> ' + entry.target);
}
console.log('\nTotal added:', added);
console.log('Total entries:', dict.entries.length);

await writeFile(dictPath, JSON.stringify(dict, null, 2) + '\n');
