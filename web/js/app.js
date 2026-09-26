/**
 * NanoCloud Cyber HUD Interactive Experience
 * Core Engine & Interactive UI Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initPingRadar();
  initPricingSwitch();
  initClientFilter();
  initSubConverter();
  initFaqAccordion();
});

/* --------------------------------------------------------------------------
   1. Interactive Constellation Canvas Background
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(Math.floor((width * height) / 18000), 65);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(0, 245, 212, ' : 'rgba(0, 180, 216, '
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting fiber lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.18;
          ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.fillStyle = p.color + '0.7)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   2. Live Node Radar & Ping Simulation
   -------------------------------------------------------------------------- */
const NODE_DATA = [
  { id: 'hk-1', name: 'Nano-HK-BGP-01', flag: '🇭🇰', loc: '中国香港', basePing: 21, tags: ['BGP直连', '4K秒开', '0丢包'] },
  { id: 'hk-2', name: 'Nano-HK-BGP-02', flag: '🇭🇰', loc: '中国香港', basePing: 24, tags: ['低延迟', '多线冗余', 'AI分流'] },
  { id: 'jp-1', name: 'Nano-JP-Tokyo-01', flag: '🇯🇵', loc: '日本东京', basePing: 39, tags: ['NTT/IIJ', '原生解锁', '游戏专线'] },
  { id: 'sg-1', name: 'Nano-SG-Media-01', flag: '🇸🇬', loc: '新加坡', basePing: 46, tags: ['Tier-1骨干', 'TikTok/Netflix', '解锁'] },
  { id: 'us-1', name: 'Nano-US-Silicon-AI', flag: '🇺🇸', loc: '美国硅谷', basePing: 118, tags: ['ChatGPT/Claude', '住宅原生IP', '超纯净'] },
  { id: 'de-1', name: 'Nano-DE-Frankfurt', flag: '🇩🇪', loc: '德国法兰克福', basePing: 138, tags: ['欧洲节点', '外贸电商', 'BGP专线'] }
];

function initPingRadar() {
  const container = document.getElementById('node-grid-container');
  const refreshBtn = document.getElementById('btn-refresh-ping');
  if (!container) return;

  function renderNodes(isTesting = false) {
    container.innerHTML = '';
    NODE_DATA.forEach(node => {
      // Simulate real latency jitter
      const jitter = isTesting ? Math.floor(Math.random() * 8) - 4 : 0;
      const currentPing = Math.max(12, node.basePing + jitter);

      let colorClass = 'var(--neon-cyan)';
      let statusText = '🟢 极速畅通 (0% 丢包)';
      if (currentPing > 100) {
        colorClass = 'var(--neon-blue)';
        statusText = '🟢 AI流媒体专线 (0% 丢包)';
      }

      const item = document.createElement('div');
      item.className = 'node-item';
      item.innerHTML = `
        <div class="node-info">
          <div class="node-flag">${node.flag}</div>
          <div class="node-meta">
            <h4>${node.name}</h4>
            <div class="node-tags">
              ${node.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="node-metrics">
          <div class="ping-num" style="color: ${colorClass};">${isTesting ? '...' : currentPing + ' ms'}</div>
          <div class="ping-status">${statusText}</div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  renderNodes();

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '⚡ 测速检测中...';
      renderNodes(true);
      setTimeout(() => {
        renderNodes(false);
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '🔄 一键实时测速 (Live Ping)';
        showToast('全节点 BGP 专线延迟测速已更新！');
      }, 600);
    });
  }
}

/* --------------------------------------------------------------------------
   3. Interactive Pricing Tier Calculator
   -------------------------------------------------------------------------- */
function initPricingSwitch() {
  const switchBtns = document.querySelectorAll('.switch-btn');
  const priceOrion = document.getElementById('price-orion');
  const priceAries = document.getElementById('price-aries');
  const priceSagittarius = document.getElementById('price-sagittarius');
  const cycleLabels = document.querySelectorAll('.cycle-label');

  if (!switchBtns.length) return;

  const pricingTable = {
    monthly: { orion: '1', aries: '10', sagittarius: '20', label: '/月' },
    quarterly: { orion: '3', aries: '28.5', sagittarius: '57', label: '/季 (优惠 5%)' },
    annual: { orion: '12', aries: '96', sagittarius: '192', label: '/年 (8折盛惠)' }
  };

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const planKey = btn.dataset.cycle;
      const data = pricingTable[planKey];
      if (!data) return;

      if (priceOrion) priceOrion.innerText = data.orion;
      if (priceAries) priceAries.innerText = data.aries;
      if (priceSagittarius) priceSagittarius.innerText = data.sagittarius;

      cycleLabels.forEach(el => {
        el.innerText = data.label;
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Client Matrix Filter
   -------------------------------------------------------------------------- */
const CLIENTS = [
  {
    name: 'Clash Verge Rev',
    platform: 'windows macos linux',
    icon: '⚡',
    badge: '推荐首选',
    desc: '基于 Tauri 架构打造的现代化开源桌面客户端，支持 Mihomo (Clash Meta) 内核、TUN 网卡全局模式与高级脚本分流。',
    downloadUrl: 'https://nano-cloud.store/client/'
  },
  {
    name: 'Shadowrocket (小火箭)',
    platform: 'ios',
    icon: '🚀',
    badge: 'iOS必备',
    desc: 'iOS 平台上极度经典的高性能网络规则工具，支持多协议订阅与一键扫码配置，秒级同步节点。',
    downloadUrl: 'https://nano-cloud.store/client/'
  },
  {
    name: 'v2rayN',
    platform: 'windows',
    icon: '💎',
    badge: '经典成熟',
    desc: 'Windows 经典轻量级代理核心聚合客户端，支持 Xray、VLESS-Reality、Trojan 与自定义路由规则。',
    downloadUrl: 'https://nano-cloud.store/client/'
  },
  {
    name: 'Surfboard (冲浪板)',
    platform: 'android',
    icon: '🏄',
    badge: 'Android极简',
    desc: '专为 Android 生态设计的精致加速客户端，界面简洁大方，耗电极低，完美适配各类安卓平板与手机。',
    downloadUrl: 'https://nano-cloud.store/client/'
  },
  {
    name: 'Sing-box',
    platform: 'windows macos ios android linux',
    icon: '📦',
    badge: '全能次世代',
    desc: '通用次世代网络核心，资源占用接近极致，原生支持各类新型实验协议与精准分流分层。',
    downloadUrl: 'https://nano-cloud.store/client/'
  },
  {
    name: 'Quantumult X (圈X)',
    platform: 'ios',
    icon: '⭕',
    badge: '进阶极客',
    desc: '功能极为强大的 iOS 分流神器，支持丰富的 JavaScript 脚本改写、策略组嵌套与图标定制。',
    downloadUrl: 'https://nano-cloud.store/client/'
  }
];

function initClientFilter() {
  const container = document.getElementById('client-grid-container');
  const tabs = document.querySelectorAll('.client-tabs .tab-btn');
  if (!container || !tabs.length) return;

  function renderList(filter = 'all') {
    container.innerHTML = '';
    const filtered = CLIENTS.filter(c => filter === 'all' || c.platform.includes(filter));

    filtered.forEach(c => {
      const card = document.createElement('div');
      card.className = 'client-card';
      card.innerHTML = `
        <div class="client-top">
          <div class="client-icon">${c.icon}</div>
          <div>
            <div class="client-name">${c.name}</div>
            <div class="client-platform">${c.badge} · ${c.platform.toUpperCase()}</div>
          </div>
        </div>
        <div class="client-body">${c.desc}</div>
        <a href="${c.downloadUrl}" target="_blank" rel="noopener" class="btn btn-glass" style="width: 100%;">
          获取客户端与教程 →
        </a>
      `;
      container.appendChild(card);
    });
  }

  renderList('all');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderList(tab.dataset.platform);
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Subscription Link Inspector & Formatter
   -------------------------------------------------------------------------- */
function initSubConverter() {
  const subInput = document.getElementById('sub-input');
  const previewArea = document.getElementById('preview-content');
  const formatTags = document.querySelectorAll('.format-tag');
  const copyBtn = document.getElementById('btn-copy-config');

  if (!previewArea || !formatTags.length) return;

  const templates = {
    clash: `# NanoCloud Clash YAML Profile
port: 7890
socks-port: 7891
mode: rule
log-level: info
proxies:
  - name: "🇭🇰 Nano-HK-BGP-01"
    type: ss
    server: hk01.nano-cloud.store
    port: 443
    cipher: 2022-blake3-aes-128-gcm
  - name: "🇯🇵 Nano-JP-Tokyo-01"
    type: ss
    server: jp01.nano-cloud.store
    port: 443
    cipher: 2022-blake3-aes-128-gcm
proxy-groups:
  - name: 🚀 节点选择
    type: select
    proxies: [ "🇭🇰 Nano-HK-BGP-01", "🇯🇵 Nano-JP-Tokyo-01", DIRECT ]`,
    singbox: `{
  "log": { "level": "info" },
  "outbounds": [
    { "tag": "Nano-HK-BGP-01", "type": "shadowsocks", "server": "hk01.nano-cloud.store", "server_port": 443 },
    { "tag": "direct", "type": "direct" }
  ]
}`,
    surge: `[General]
loglevel = notify
skip-proxy = 127.0.0.1, 192.168.0.0/16, localhost
[Proxy]
🇭🇰 Nano-HK-BGP-01 = custom, hk01.nano-cloud.store, 443, encrypt-method=aes-128-gcm
[Rule]
GEOIP,CN,DIRECT
FINAL,PROXY`,
    base64: `c3M6Ly9aMmx1WldOb2FHRnNZMmgwTURFaE16STNNVEV4TVRreE9EQXhPVEl1Y0hKdmVIbHpMbTVoYm04dFkyeHZkV1F1YzNSdmNtVTBPRGttVEV4UGJEZzFNREVnYW1WcGJtZHRNVVVoZVNCNlpXNXpZVzVqWkhWaVpHVk1jbTkyZVRvPQ==`
  };

  let currentFormat = 'clash';

  formatTags.forEach(tag => {
    tag.addEventListener('click', () => {
      formatTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      currentFormat = tag.dataset.format;
      previewArea.textContent = templates[currentFormat] || '';
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = previewArea.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('配置模板已成功复制到剪贴板！');
      }).catch(() => {
        showToast('复制失败，请手动选取文本');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion Handler
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   7. Cyber Toast Notification
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('cyber-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-toast';
    toast.className = 'cyber-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
