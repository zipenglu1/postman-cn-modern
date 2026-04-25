import { spawn } from 'node:child_process';
import { join } from 'node:path';

export function assertWebSocketSupport() {
  if (typeof WebSocket !== 'function') {
    throw new Error('This script requires a Node.js runtime with global WebSocket support.');
  }
}

export function launchPostmanWithDebugPort(installDir, debugPort) {
  const exe = join(installDir, 'Postman.exe');
  const child = spawn(exe, [`--remote-debugging-port=${debugPort}`], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
}

export async function waitForPostmanTarget(debugPort, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const targets = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`);
      const page = targets.find((target) =>
        target.webSocketDebuggerUrl &&
        target.type === 'page' &&
        (/postman/i.test(target.title) || /desktop\.postman\.com|file:\/\//i.test(target.url))
      );
      if (page) return page;
    } catch (error) {
      lastError = error;
    }
    await sleep(500);
  }
  throw new Error(`Could not find a Postman DevTools target on port ${debugPort}: ${lastError?.message ?? 'timed out'}`);
}

export async function captureVisibleItems(client) {
  return client.evaluate(DOM_CAPTURE_SOURCE);
}

export async function clickVisibleText(client, label) {
  return client.evaluate(`(${CLICK_VISIBLE_TEXT_SOURCE})(${JSON.stringify(label)})`);
}

export async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

export class CdpClient {
  static async connect(webSocketUrl) {
    const socket = new WebSocket(webSocketUrl);
    const client = new CdpClient(socket);
    await new Promise((resolveConnect, rejectConnect) => {
      socket.addEventListener('open', resolveConnect, { once: true });
      socket.addEventListener('error', rejectConnect, { once: true });
    });
    socket.addEventListener('message', (event) => client.handleMessage(event));
    return client;
  }

  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text ?? 'Runtime.evaluate failed');
    }
    return result.result.value;
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const message = JSON.stringify({ id, method, params });
    const promise = new Promise((resolveSend, rejectSend) => {
      this.pending.set(id, { resolve: resolveSend, reject: rejectSend });
    });
    this.socket.send(message);
    return promise;
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);
    if (!message.id || !this.pending.has(message.id)) return;
    const pending = this.pending.get(message.id);
    this.pending.delete(message.id);
    if (message.error) {
      pending.reject(new Error(message.error.message));
    } else {
      pending.resolve(message.result);
    }
  }

  close() {
    this.socket.close();
  }
}

export function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

const CLICK_VISIBLE_TEXT_SOURCE = String.raw`
(label) => {
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const isVisible = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const labelsFor = (element) => [
    element.getAttribute('aria-label'),
    element.getAttribute('title'),
    element.getAttribute('placeholder'),
    element.innerText,
    element.textContent
  ].map(normalize).filter(Boolean);
  const selector = [
    'button',
    'a',
    '[role="button"]',
    '[role="tab"]',
    '[aria-label]',
    '[title]',
    '[tabindex]'
  ].join(',');
  const target = normalize(label);
  for (const element of document.querySelectorAll(selector)) {
    if (!isVisible(element)) continue;
    const labels = labelsFor(element);
    if (!labels.some((item) => item === target)) continue;
    element.scrollIntoView({ block: 'center', inline: 'center' });
    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    element.click();
    return {
      clicked: true,
      label: target,
      tag: element.tagName.toLowerCase(),
      matchedText: labels[0] ?? ''
    };
  }
  return { clicked: false, label: target };
}
`;

const DOM_CAPTURE_SOURCE = String.raw`
(() => {
  const items = [];
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const selectorFor = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return null;
    const parts = [];
    let current = element;
    while (current && current.nodeType === Node.ELEMENT_NODE && parts.length < 5) {
      const label = current.id
        ? current.tagName.toLowerCase() + '#' + current.id
        : current.tagName.toLowerCase();
      parts.unshift(label);
      current = current.parentElement;
    }
    return parts.join(' > ');
  };
  const isVisible = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const add = (text, kind, element) => {
    const normalized = normalize(text);
    if (!normalized) return;
    items.push({
      text: normalized,
      kind,
      tag: element?.tagName?.toLowerCase() ?? null,
      selector: selectorFor(element)
    });
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) continue;
    if (!isVisible(parent)) continue;
    add(node.nodeValue, 'text', parent);
  }

  for (const element of document.querySelectorAll('[placeholder], [title], [aria-label]')) {
    if (!isVisible(element)) continue;
    for (const attribute of ['placeholder', 'title', 'aria-label']) {
      if (element.hasAttribute(attribute)) add(element.getAttribute(attribute), attribute, element);
    }
  }

  return items;
})()
`;
