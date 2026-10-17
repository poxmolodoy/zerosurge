# ZeroSurge ⚡

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline--first-10B981.svg?logo=pwa)](https://poxmolodoy.github.io/zerosurge/)
[![CI](https://github.com/poxmolodoy/zerosurge/actions/workflows/ci.yml/badge.svg)](https://github.com/poxmolodoy/zerosurge/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Local-only](https://img.shields.io/badge/Architecture-Local--only-success.svg)](#privacy--security-model)

🌐 **[Русская версия (README.md)](README.md)**

<p align="left">
  <a href="https://poxmolodoy.github.io/zerosurge/">
    <img src="https://img.shields.io/badge/Launch%20Web%20App%20(PWA)-Run%20Online%20%26%20Offline-10B981?style=for-the-badge&logo=pwa&logoColor=white" alt="Open Web PWA" />
  </a>
</p>

An offline-first, evidence-based Progressive Web App (PWA) designed to help overcome dependence on energy drinks and high-dose caffeine. Runs on any device (smartphones, tablets, desktop) right in your browser or installed directly to your home screen.

Zero tracking, zero analytics, no telemetry, no subscriptions. All calculations, timers, and journal logs remain strictly on your local machine in `localStorage`. With an integrated Service Worker, the application works seamlessly even with no internet connection.

---

## ⚡ Core Features

- ⏱ **Second-by-second Live Timer:** Precision timer tracking clean time, saved money, and prevented grams of sugar.
- 🔬 **Evidence-Based Pathophysiology Atlas:** Interactive overview of how high-dose caffeine, taurine, and sugar impact 6 body systems with direct links to PubMed, DOI, and WHO studies.
- 📉 **Fair Relapse Penalty Algorithm:** Relapses do not reset hard-earned physiological progress back to zero. A balanced mathematical penalty subtracts hours proportional to clean time, combating the _Abstinence Violation Effect_.
- 📉 **Tapering Reduction Program:** Customized gradual caffeine reduction schedule over 14–42 days with daily limit tracking.
- ☕ **Caffeine Consumption Journal:** Log daily intake with accurate EFSA benchmarks and custom drinks.
- 🚨 **Emergency SOS Tool:** Box Breathing (4-4-4-4) visual pacer and guided Urge Surfing protocol to overcome acute cravings.
- 📊 **Health & Craving Journal:** Daily tracking of energy, sleep quality, and craving intensity mapped against clinical neuroadaptation curves.
- 📦 **Secure Data Backup & Restore:** Complete export and import in JSON format with strict prototype pollution protection, date validation, and numeric clamping.
- 🎨 **Interactive Neural Background:** Canvas particle physics with instant Eco-mode toggle for low-power devices.

---

## 📱 Installation (PWA)

ZeroSurge is a full Progressive Web App that can be installed without an app store:

- **iOS (iPhone / iPad):**
  1. Open [https://poxmolodoy.github.io/zerosurge/](https://poxmolodoy.github.io/zerosurge/) in Safari.
  2. Tap the **Share** button (box with an upward arrow at the bottom).
  3. Select **Add to Home Screen**.
- **Android:**
  1. Open the website in Google Chrome.
  2. Tap the banner or the three dots menu and select **Install App**.
- **Desktop (Chrome, Edge, Brave on Windows, macOS, Linux):**
  1. Open the website in your browser.
  2. Click the install icon in the right side of the address bar.

---

## 🛡️ Privacy & Security Model

ZeroSurge is built on a strict **Local-only** architecture:

- **0 bytes transmitted:** No analytics, no Google Analytics, no third-party telemetry, no cloud servers.
- **Isolated storage:** All data is kept exclusively in browser `localStorage`.
- **Strict Content-Security-Policy (CSP):** Zero remote scripts, zero remote stylesheets. Fonts (Inter, JetBrains Mono) are bundled locally.
- **Production dependencies:** 0 high/critical vulnerabilities via `npm audit --omit=dev --audit-level=high`.

For details, refer to [docs/threat-model.md](docs/threat-model.md) and [SECURITY.md](SECURITY.md).

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
```

---

## 📄 License & Medical Disclaimer

- Released under the open-source **MIT License**. See [LICENSE](LICENSE) for terms.
- **Medical Disclaimer:** ZeroSurge provides educational and tracking information based on open clinical literature. It is not medical advice. Individuals suffering from severe cardiovascular conditions, hypertension, or acute stimulant withdrawal should consult a qualified healthcare professional.
