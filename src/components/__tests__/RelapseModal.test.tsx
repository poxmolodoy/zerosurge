import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RelapseModal } from '../RelapseModal';

describe('RelapseModal Component (TDD)', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirmRelapse: vi.fn(),
    currentCansAvoided: 3.0,
    cansPerDay: 2,
    quitTimestamp: Date.now() - 36 * 3600 * 1000, // 36 hours ago = 3 cans avoided
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<RelapseModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders title, presets, and live impact card when open', () => {
    render(<RelapseModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Фиксация срыва')).toBeInTheDocument();
    expect(screen.getByText('1 банка')).toBeInTheDocument();
    expect(screen.getByText('2 банки')).toBeInTheDocument();
    expect(screen.getByText('3 банки')).toBeInTheDocument();
  });

  it('updates selected cans on preset click', () => {
    render(<RelapseModal {...defaultProps} />);

    const preset2 = screen.getByText('2 банки');
    fireEvent.click(preset2);

    // Live preview shows 2 cans penalty and 1 can remaining (3 - 2 = 1)
    expect(screen.getByTestId('remaining-cans-preview')).toHaveTextContent('1');
  });

  it('displays warning when relapsed cans >= accumulated cans', () => {
    render(<RelapseModal {...defaultProps} currentCansAvoided={1.5} />);

    // Click 2 cans preset (2 > 1.5)
    const preset2 = screen.getByText('2 банки');
    fireEvent.click(preset2);

    expect(screen.getByTestId('reset-warning-badge')).toBeInTheDocument();
  });

  it('calls onConfirmRelapse with selected cans count when confirmed', () => {
    const onConfirmRelapse = vi.fn();
    render(<RelapseModal {...defaultProps} onConfirmRelapse={onConfirmRelapse} />);

    const confirmButton = screen.getByRole('button', { name: /подтвердить срыв/i });
    fireEvent.click(confirmButton);

    expect(onConfirmRelapse).toHaveBeenCalledWith(1, 'energy', false);
  });

  it('switches between energy drink and coffee mode', () => {
    const onConfirmRelapse = vi.fn();
    render(<RelapseModal {...defaultProps} onConfirmRelapse={onConfirmRelapse} />);

    // Click Coffee toggle
    const coffeeTab = screen.getByRole('button', { name: /кофе/i });
    fireEvent.click(coffeeTab);

    expect(screen.getByText('1 чашка')).toBeInTheDocument();
    expect(screen.getByText('2 чашки')).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /подтвердить срыв/i });
    fireEvent.click(confirmButton);

    expect(onConfirmRelapse).toHaveBeenCalledWith(1, 'coffee', false);
  });

  it('allows toggling sugar-free for energy drink', () => {
    const onConfirmRelapse = vi.fn();
    render(<RelapseModal {...defaultProps} onConfirmRelapse={onConfirmRelapse} />);

    // Toggle Sugar-free
    const sugarFreeBtn = screen.getByRole('button', { name: /без сахара|zero/i });
    fireEvent.click(sugarFreeBtn);

    const confirmButton = screen.getByRole('button', { name: /подтвердить срыв/i });
    fireEvent.click(confirmButton);

    expect(onConfirmRelapse).toHaveBeenCalledWith(1, 'energy', true);
  });

  it('calls onClose on cancel button click or Escape key', () => {
    const onClose = vi.fn();
    render(<RelapseModal {...defaultProps} onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /отмена/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
