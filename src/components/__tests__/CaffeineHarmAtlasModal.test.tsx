import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CaffeineHarmAtlasModal } from '../CaffeineHarmAtlasModal';

describe('CaffeineHarmAtlasModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(<CaffeineHarmAtlasModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with CaffeineHarmGrid when isOpen is true', () => {
    render(<CaffeineHarmAtlasModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: /Клинический атлас/i })).toBeInTheDocument();
    expect(screen.getByText(/Сердечно-сосудистая система/i)).toBeInTheDocument();
    expect(screen.getByText(/Нервная система и сон/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked or Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<CaffeineHarmAtlasModal isOpen={true} onClose={onClose} />);

    // 1. Close button
    const closeBtn = screen.getByLabelText('Закрыть клинический атлас');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    // 2. Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
