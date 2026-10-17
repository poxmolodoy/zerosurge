import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Electron Hardening & Security Configuration (P1-2 & P1-3)', () => {
  const mainCjsPath = path.resolve(__dirname, '../../electron/main.cjs');
  const mainCjs = fs.readFileSync(mainCjsPath, 'utf8');

  it('enforces sandbox: true in webPreferences', () => {
    expect(mainCjs).toMatch(/sandbox:\s*true/);
  });

  it('enforces contextIsolation: true and nodeIntegration: false', () => {
    expect(mainCjs).toMatch(/contextIsolation:\s*true/);
    expect(mainCjs).toMatch(/nodeIntegration:\s*false/);
  });

  it('enforces webSecurity: true and allowRunningInsecureContent: false', () => {
    expect(mainCjs).toMatch(/webSecurity:\s*true/);
    expect(mainCjs).toMatch(/allowRunningInsecureContent:\s*false/);
  });

  it('rejects all permission requests via setPermissionRequestHandler', () => {
    expect(mainCjs).toContain('setPermissionRequestHandler');
    expect(mainCjs).toMatch(/callback\(false\)/);
  });

  it('intercepts and blocks unauthorized navigations via will-navigate', () => {
    expect(mainCjs).toContain('will-navigate');
    expect(mainCjs).toContain('event.preventDefault()');
  });

  it('safely handles external links with setWindowOpenHandler denying popup windows', () => {
    expect(mainCjs).toContain('setWindowOpenHandler');
    expect(mainCjs).toContain("action: 'deny'");
    expect(mainCjs).toContain('shell.openExternal');
  });

  it('configures portable userData directory next to executable via PORTABLE_EXECUTABLE_DIR', () => {
    expect(mainCjs).toContain('process.env.PORTABLE_EXECUTABLE_DIR');
    expect(mainCjs).toContain("app.setPath('userData'");
    expect(mainCjs).toContain('ZeroSurgeData');
  });
});
