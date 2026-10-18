import { useEffect, useRef } from 'react';

/**
 * Hook to support Android hardware back button and iOS browser back swipe for modals.
 * Pushes a history state when modal opens, replaces state when switching between modals,
 * and closes modal on popstate/back action without double pops or race conditions.
 */
export function useModalBackHandler(isOpen: boolean, onClose: () => void, modalId: string) {
  const isClosedByPopStateRef = useRef(false);
  const prevIsOpenRef = useRef(false);
  const modalIdRef = useRef(modalId);
  modalIdRef.current = modalId;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isOpen) {
      if (prevIsOpenRef.current) {
        document.body.style.overflow = '';
        if (
          !isClosedByPopStateRef.current &&
          window.history.state?.modalId === modalIdRef.current
        ) {
          window.history.back();
        }
        isClosedByPopStateRef.current = false;
        prevIsOpenRef.current = false;
      }
      return;
    }

    document.body.style.overflow = 'hidden';

    if (!prevIsOpenRef.current) {
      isClosedByPopStateRef.current = false;
      window.history.pushState({ modalId }, '');
      prevIsOpenRef.current = true;
    } else {
      window.history.replaceState({ modalId }, '');
    }

    const handlePopState = () => {
      isClosedByPopStateRef.current = true;
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, modalId]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      document.body.style.overflow = '';
      if (prevIsOpenRef.current && !isClosedByPopStateRef.current) {
        if (window.history.state?.modalId === modalIdRef.current) {
          window.history.back();
        }
      }
    };
  }, []);
}
