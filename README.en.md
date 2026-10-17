# ZeroSurge ⚡

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Electron](https://img.shields.io/badge/Electron-44.9-47848F.svg?logo=electron)](https://www.electronjs.org/)
[![CI](https://github.com/poxmolodoy/zerosurge/actions/workflows/ci.yml/badge.svg)](https://github.com/poxmolodoy/zerosurge/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Local-only](https://img.shields.io/badge/Architecture-Local--only-success.svg)](#privacy--security-model)

🌐 **[Русская версия (README.md)](README.md)**

<p align="left">
  <a href="https://github.com/poxmolodoy/zerosurge/releases/download/v1.0.0/ZeroSurge-1.0-Portable.exe">
    <img src="https://img.shields.io/badge/Download%20Portable%20v1.0-(97%20MB)-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Download Windows Portable" />
  </a>
  <a href="https://github.com/poxmolodoy/zerosurge/releases/tag/v1.0.0">
    <img src="https://img.shields.io/badge/GitHub-Release%20v1.0.0-238636?style=for-the-badge&logo=github&logoColor=white" alt="Release Page" />
  </a>
</p>

An offline, evidence-based educational tracker designed to help overcome dependence on energy drinks and high-dose caffeine. Available as a portable standalone Windows executable (`ZeroSurge-1.0-Portable.exe`) and as a web application.

Zero tracking, zero analytics, no telemetry, no subscriptions. All calculations, timers, and journal logs remain strictly on your local machine.

---

## ⚡ Core Features

- ⏱ **Second-by-second Live Timer:** Anti-drift background timer designed for desktop without throttling when minimized.
- 🔬 **Evidence-Based Pathophysiology Atlas:** Interactive overview of how high-dose caffeine, taurine, and sugar impact 6 body systems (cardiovascular, nervous, endocrine, GI, renal, enamel) with direct links to PubMed, DOI, and WHO studies.
- 📉 **Fair Relapse Penalty Algorithm:** Relapses do not reset hard-earned physiological progress back to zero. A balanced mathematical penalty subtracts hours proportional to elapsed clean time, combating the *abstinence violation effect*.
- 🚨 **Emergency SOS Tool:** Box Breathing (4-4-4-4) visual pacer and guided Urge Surfing protocol to overcome acute cravings.
- 📊 **Health & Craving Journal:** Daily tracking of energy, sleep quality, and craving intensity mapped against clinical neuroadaptation curves.
- 📦 **Secure Data Backup & Restore:** Complete export and import in JSON format with strict prototype pollution protection, date validation, and numeric clamping.
- 🎨 **60 FPS Interactive Neural Background:** Smooth Canvas particle physics with instant Eco-mode toggle for low-power laptops.

---

## 🛡️ Privacy & Security Model

ZeroSurge is designed around a strict **Local-only** architecture:

- **0 bytes transmitted:** No analytics, no Google Analytics, no third-party telemetry, no cloud servers.
- **Isolated storage:** All data is held in browser/Electron `localStorage`.
- **Strict Content-Security-Policy (CSP):** Zero remote scripts, zero remote stylesheets. Fonts (Inter, JetBrains Mono) are bundled locally (verified by `npm run check:offline`).
- **Electron Hardening:** `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, blocking of all OS permission requests, external link interception via `shell.openExternal`.
- **Production dependencies:** 0 high/critical vulnerabilities via `npm audit --omit=dev --audit-level=high`.

For details, refer to [docs/threat-model.md](docs/threat-model.md) and [SECURITY.md](SECURITY.md).

---

## 📦 Download & Run (Windows Portable)

1. Download **[ZeroSurge-1.0-Portable.exe](https://github.com/poxmolodoy/zerosurge/releases/download/v1.0.0/ZeroSurge-1.0-Portable.exe)** and `SHA256SUMS.txt` from the [Releases](https://github.com/poxmolodoy/zerosurge/releases/tag/v1.0.0) section.
2. Run the executable. No installation required.
3. Portable mode automatically creates and preserves user data in `ZeroSurgeData/` next to the executable, making it ideal for running from USB flash drives.

### Verifying Checksum
```powershell
Get-FileHash .\ZeroSurge-1.0-Portable.exe -Algorithm SHA256
```
Compare the resulting hash with `SHA256SUMS.txt`.

### Windows SmartScreen Notice
ZeroSurge is an open-source non-commercial application distributed without an expensive corporate Authenticode certificate. If Windows Defender SmartScreen shows a warning on first launch:
- Click **"More info" (Подробнее) → "Run anyway" (Выполнить в любом случае)**.
- Every release is built transparently via [.github/workflows/release.yml](.github/workflows/release.yml).

---

## 🛠️ Build from Source

### Prerequisites
- Node.js 18.0+
- npm 9.0+

```bash
# Clone repository
git clone https://github.com/poxmolodoy/zerosurge.git
cd zerosurge

# Install dependencies
npm ci

# Run development server
npm run dev

# Run test suite
npm test

# Build production bundle
npm run build

# Verify local-only offline integrity
npm run check:offline

# Package Windows Portable .exe
npm run electron:build:portable
```

---

## ⚠️ Limitations

- **Platforms:** Windows standalone portable executable (`.exe`) or any modern web browser.
- **No Cloud Sync:** By design, there is no automatic cloud sync across devices. Use the built-in JSON Export/Import in Settings to transfer data between machines.
- **Authenticode:** The executable is unsigned. SmartScreen warnings may appear upon first launch.

---

## 📄 License & Medical Disclaimer

- Released under the open-source **MIT License**. See [LICENSE](LICENSE) for terms.
- **Medical Disclaimer:** ZeroSurge provides educational and tracking information based on open clinical literature. It is not medical advice. Individuals suffering from severe cardiovascular conditions, hypertension, or acute stimulant withdrawal should consult a qualified healthcare professional.
