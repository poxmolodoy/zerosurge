# Fix Post-Deploy Blank Screen Crash (ChunkLoadError & ErrorBoundary) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate post-deploy blank screen crashes caused by missing dynamic chunks when opening modals, and provide a global ErrorBoundary safety net.

**Architecture:**

1. Switch modal imports in `src/App.tsx` from `React.lazy()` to static imports. In an offline-first PWA with an ultra-light codebase (~113 KB gzipped total), bundling modals guarantees instant, reliable opening offline and across new deployments without 404 chunk errors.
2. Create `src/components/ErrorBoundary.tsx` with a branded glassmorphism recovery UI and unit test `src/components/__tests__/ErrorBoundary.test.tsx`.
3. Wrap the application tree with `<ErrorBoundary>` in `src/main.tsx` and modal portals.
4. Update `vite.config.ts` Workbox configuration with `cleanupOutdatedCaches: true`, `clientsClaim: true`, and `skipWaiting: true`.

**Tech Stack:** React 18, TypeScript, Vite, VitePWA (Workbox), Lucide Icons, Vitest.

---

### Task 1: Create ErrorBoundary Component & Unit Tests (TDD)

**Files:**

- Create: `src/components/ErrorBoundary.tsx`
- Create: `src/components/__tests__/ErrorBoundary.test.tsx`

- [ ] Write failing test in `src/components/__tests__/ErrorBoundary.test.tsx`:
  - Test that children render normally when there is no error.
  - Test that error fallback UI renders with recovery button when a child throws an error.
  - Test that clicking the reload button calls `window.location.reload()`.
- [ ] Implement `src/components/ErrorBoundary.tsx`:
  - Class component catching `componentDidCatch` and `getDerivedStateFromError`.
  - Glass-card styled fallback UI with reload button.
- [ ] Run vitest to verify all tests pass.

### Task 2: Replace Lazy Modals with Static Imports & Add ErrorBoundary to Root

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] Update `src/App.tsx`:
  - Replace `lazy(() => import(...))` for all 6 modals with direct static imports.
  - Remove unnecessary `Suspense` wrapper around modals.
- [ ] Update `src/main.tsx`:
  - Wrap `<App />` with `<ErrorBoundary>`.
- [ ] Run vitest to ensure all integration and component tests pass.

### Task 3: Enhance PWA Workbox Cache Invalidation in Vite Config

**Files:**

- Modify: `vite.config.ts`

- [ ] Add `cleanupOutdatedCaches: true`, `clientsClaim: true`, and `skipWaiting: true` to `workbox` config in `vite.config.ts`.
- [ ] Build project and verify clean PWA service worker generation.

### Task 4: Complete Verification & Deploy

- [ ] Run test suite (`vitest run`).
- [ ] Run typecheck (`tsc --noEmit`).
- [ ] Run linter (`npm run lint`).
- [ ] Run production build (`npm run build`).
- [ ] Run offline compliance check (`node scripts/check-offline.js`).
- [ ] Commit and push to `origin/main`.
