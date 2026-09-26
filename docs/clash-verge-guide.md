# Clash Verge Rev 跨平台配置与分流规则进阶指南

Clash Verge Rev 是目前主流开源的 Clash 内核桌面客户端（基于 Tauri 打造，内存占用更低、支持 Mihomo 内核与最新加密协议）。本指南面向 Windows、macOS 与 Linux 用户，详解如何快速接入 **NanoCloud 智能网络加速订阅**。

---

## 快速索引
- [1. 客户端下载与系统要求](#1-客户端下载与系统要求)
- [2. 导入 NanoCloud 订阅链接](#2-导入-nanocloud-订阅链接)
- [3. 内核模式选择（TUN 模式 vs 系统代理）](#3-内核模式选择tun-模式-vs-系统代理)
- [4. 分流规则与策略组设置（国内直连 / 海外加速）](#4-分流规则与策略组设置国内直连--海外加速)
- [5. 常见问题排查](#5-常见问题排查)

---

## 1. 客户端下载与系统要求

- **官方下载与最新版本**：请前往 [NanoCloud 客户端下载中心](https://nano-cloud.store/client/) 或 [Clash Verge Rev 官方开源仓库](https://github.com/clash-verge-rev/clash-verge-rev/releases) 下载最新发行版。
- **系统要求**：
  - Windows 10/11 64 位（支持 ARM64 与 x64）
  - macOS 11+（Intel 与 Apple Silicon 原生支持）
  - Linux（提供 AppImage, deb, rpm 格式）

---

## 2. 导入 NanoCloud 订阅链接

1. 登录 [NanoCloud 官网后台](https://nano-cloud.store/) 获取您的专属订阅 URL。
2. 打开 Clash Verge Rev 客户端，点击左侧菜单栏 **「订阅 (Profiles)」**。
3. 在顶部输入框粘贴 NanoCloud 订阅链接，点击 **「保存并导入」**。
4. 订阅更新成功后，右键该配置卡片，选择 **「使用 (Use)」**。
5. 建议右键开启 **「自动更新 (Auto Update)」**，更新周期建议设置为 `12` 或 `24` 小时，以保障随时同步最新 BGP 节点。

---

## 3. 内核模式选择（TUN 模式 vs 系统代理）

| 模式 | 运行机制 | 适用场景 | 注意事项 |
| :--- | :--- | :--- | :--- |
| **系统代理 (System Proxy)** | 仅代理支持 HTTP/SOCKS 协议的浏览器与常规应用 | 网页浏览、ChatGPT 交互、常规办公 | 游戏与部分命令行工具不生效 |
| **TUN 虚拟网卡模式** | 接管操作系统全部流量，包括终端、游戏、Docker | 终端 Git 加速、Steam/外服游戏联机、不支持代理的应用 | 需管理员权限安装虚拟网卡驱动 |

> **提示**：如需全局代理终端（如 `git clone` 或 `npm install`），直接开启 Clash Verge Rev 侧边栏的 **TUN 模式** 即可，无需在终端手动配置 `http_proxy` 环境变量。

---

## 4. 分流规则与策略组设置（国内直连 / 海外加速）

NanoCloud 订阅默认内置精细化规则分流策略：
- **AUTO / 自动优选**：通过定期测速延迟，自动调度最快优质节点。
- **ChatGPT / Claude / Copilot 策略组**：建议手动固定绑定至 **US (美国)** 或 **JP (日本)** 节点，避免 IP 变动触发 AI 平台安全风控。
- **流媒体解锁 (Netflix / Disney+ / YouTube 4K)**：选择带有 `流媒体解锁` 标识的香港或新加坡 BGP 专线节点，秒开 4K 无卡顿。
- **国内流量 (DIRECT)**：百度、微信、淘宝、B站等国内访问自动直连，不消耗套餐流量。

---

## 5. 常见问题排查

1. **订阅拉取显示 403 / 500 / Network Error**：
   - 检查网络环境是否处于白名单隔离区；
   - 在 Clash Verge 中开启「允许不安全证书」临时拉取，或更换浏览器访问官网刷新订阅地址。
2. **连接成功后网页无法打开 (DNS 污染或时间误差)**：
   - 检查电脑系统时间与北京时间误差是否大于 60 秒；
   - 重启 Clash Verge 内核并清理本地 DNS 缓存（Windows 执行 `ipconfig /flushdns`）。
