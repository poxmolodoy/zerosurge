import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

const Bomb: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test explosion');
  }
  return <div>Всё работает нормально</div>;
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error in tests for intentional throw
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Всё работает нормально')).toBeInTheDocument();
  });

  it('renders fallback UI with reload button when a child component throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Всё работает нормально')).not.toBeInTheDocument();
    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Перезагрузить страницу/i })).toBeInTheDocument();
  });

  it('calls window.location.reload when reload button is clicked', () => {
    const originalLocation = window.location;
    const reloadMock = vi.fn();

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: reloadMock },
    });

    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByRole('button', { name: /Перезагрузить страницу/i });
    fireEvent.click(reloadBtn);

    expect(reloadMock).toHaveBeenCalledTimes(1);

    // Restore location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });
});
