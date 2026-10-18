import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useModalBackHandler } from '../useModalBackHandler';

describe('useModalBackHandler hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('does nothing when isOpen is false', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler(false, onClose, 'testModal'));

    expect(pushStateSpy).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('');
  });

  it('pushes history state and locks body scroll when isOpen is true', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler(true, onClose, 'testModal'));

    expect(pushStateSpy).toHaveBeenCalledWith({ modalId: 'testModal' }, '');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('calls onClose when popstate event fires', () => {
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler(true, onClose, 'testModal'));

    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls history.back when Escape key is pressed', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const onClose = vi.fn();

    renderHook(() => useModalBackHandler(true, onClose, 'testModal'));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('restores body overflow and pops state on unmount if modal state matches', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const onClose = vi.fn();

    // Mock history.state to match modalId
    Object.defineProperty(window.history, 'state', {
      value: { modalId: 'testModal' },
      configurable: true,
      writable: true,
    });

    const { unmount } = renderHook(() => useModalBackHandler(true, onClose, 'testModal'));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call history.back on unmount if modal was closed via popstate event', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const onClose = vi.fn();

    Object.defineProperty(window.history, 'state', {
      value: { modalId: 'testModal' },
      configurable: true,
      writable: true,
    });

    const { unmount } = renderHook(() => useModalBackHandler(true, onClose, 'testModal'));

    // Trigger popstate
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(onClose).toHaveBeenCalledTimes(1);

    // Unmount
    unmount();
    // backSpy should NOT have been called on unmount because popstate already took care of history
    expect(backSpy).not.toHaveBeenCalled();
  });

  it('uses replaceState and does not call history.back when switching between modals while open', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const onClose = vi.fn();

    const { rerender } = renderHook(
      ({ id }: { id: string }) => useModalBackHandler(true, onClose, id),
      { initialProps: { id: 'firstModal' } }
    );

    expect(replaceStateSpy).not.toHaveBeenCalled();

    // Switch to another modal while remaining open
    rerender({ id: 'secondModal' });

    expect(replaceStateSpy).toHaveBeenCalledWith({ modalId: 'secondModal' }, '');
    expect(backSpy).not.toHaveBeenCalled();
  });
});
