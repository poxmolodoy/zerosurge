# Security Policy

## Supported Versions

Only the latest release branch of ZeroSurge receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security and privacy of ZeroSurge users seriously. If you believe you have found a security vulnerability, please report it responsibly.

### 1. Preferred Method: GitHub Private Vulnerability Reporting
Please submit a report through GitHub's private vulnerability reporting feature:
👉 **[Report a Security Advisory on GitHub](https://github.com/poxmolodoy/zerosurge/security/advisories/new)**

This allows us to review and address the issue privately without exposing details before a fix is published.

### 2. Alternative Contact
If you cannot use GitHub's advisory system, you can contact the project maintainer:
- **Email:** `TODO: owner to fill` *(в отчёте агента зафиксировано: требуется указать контактный email владельца)*

### What to Include in Your Report
To help us triage and reproduce the issue quickly, please include:
- A clear description of the vulnerability and potential impact.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- The operating system and version of ZeroSurge (web or desktop portable).

### Response Times & Coordinated Disclosure
- **Initial Acknowledgment:** within 48 hours.
- **Triage & Status Update:** within 5 business days.
- **Remediation:** We commit to releasing a patch as promptly as possible. Once fixed, a security release will be published along with appropriate credit to the reporter (unless anonymity is requested).

## Security Architecture & Threat Model

ZeroSurge is designed strictly as a local-only application. For details on how data is handled and protected on your machine, see [docs/threat-model.md](docs/threat-model.md).
