import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaperModal } from '../TaperModal';
import { TaperPlan, ConsumptionEntry } from '../../utils/taper';

describe('TaperModal Component', () => {
  const today = new Date().toISOString().split('T')[0];

  const mockPlan: TaperPlan = {
    isActive: true,
    startDate: new Date().toISOString(),
    durationDays: 14,
    startDailyMg: 300,
    targetDailyMg: 0,
  };

  const mockLog: ConsumptionEntry[] = [
    {
      id: 'entry-1',
      date: today,
      timestamp: Date.now(),
      type: 'coffee',
      title: 'Эспрессо',
      volumeMl: 60,
      caffeineMg: 60,
    },
  ];

  it('renders modal when open', () => {
    render(
      <TaperModal
        isOpen={true}
        onClose={vi.fn()}
        taperPlan={mockPlan}
        consumptionLog={mockLog}
        onSaveTaperPlan={vi.fn()}
        onAddConsumption={vi.fn()}
        onDeleteConsumption={vi.fn()}
      />
    );

    expect(screen.getByText(/Журнал кофеина и Tapering/i)).toBeInTheDocument();
    expect(screen.getByText('Эспрессо')).toBeInTheDocument();
    expect(screen.getByText(/Добавить выпитую порцию/i)).toBeInTheDocument();
  });

  it('calls onAddConsumption when quick preset button is clicked', () => {
    const onAdd = vi.fn();
    render(
      <TaperModal
        isOpen={true}
        onClose={vi.fn()}
        taperPlan={mockPlan}
        consumptionLog={mockLog}
        onSaveTaperPlan={vi.fn()}
        onAddConsumption={onAdd}
        onDeleteConsumption={vi.fn()}
      />
    );

    const espressoButtons = screen.getAllByRole('button');
    const espressoPreset = espressoButtons.find((btn) => btn.textContent?.includes('Эспрессо'));
    expect(espressoPreset).toBeDefined();
    if (espressoPreset) {
      fireEvent.click(espressoPreset);
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'coffee',
          title: 'Эспрессо (30–40 мл)',
          caffeineMg: 65,
          volumeMl: 35,
        })
      );
    }
  });

  it('calls onDeleteConsumption when delete button is clicked on an entry', () => {
    const onDelete = vi.fn();
    render(
      <TaperModal
        isOpen={true}
        onClose={vi.fn()}
        taperPlan={mockPlan}
        consumptionLog={mockLog}
        onSaveTaperPlan={vi.fn()}
        onAddConsumption={vi.fn()}
        onDeleteConsumption={onDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /Удалить запись/i });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('entry-1');
  });

  it('opens editing settings and saves updated taper plan', () => {
    const onSave = vi.fn();
    render(
      <TaperModal
        isOpen={true}
        onClose={vi.fn()}
        taperPlan={mockPlan}
        consumptionLog={mockLog}
        onSaveTaperPlan={onSave}
        onAddConsumption={vi.fn()}
        onDeleteConsumption={vi.fn()}
      />
    );

    const editBtn = screen.getByRole('button', { name: /Настроить/i });
    fireEvent.click(editBtn);

    expect(screen.getByText(/Стартовая доза \(мг в день\):/i)).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: /Сохранить параметры программы/i });
    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        isActive: true,
        targetDailyMg: 0,
      })
    );
  });
});
