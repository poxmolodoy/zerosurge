import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import App from '../App';

describe('ZeroSurge App End-to-End Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('renders Onboarding on first launch and transitions to Dashboard upon submission', async () => {
    render(<App />);

    // 1. Onboarding Modal must be open
    expect(screen.getByText('Добро пожаловать в ZeroSurge')).toBeInTheDocument();
    expect(screen.getByText('Начать путь к свободе')).toBeInTheDocument();

    // 2. Click submit button
    const submitBtn = screen.getByText('Начать путь к свободе');
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // 3. Main Dashboard elements must now be visible in ultra-decluttered layout
    expect(screen.getByText(/Таймер свободы в реальном времени/i)).toBeInTheDocument();
    expect(screen.getByText(/Сэкономлено денег/i)).toBeInTheDocument();
    expect(screen.getByText(/Не выпито порций/i)).toBeInTheDocument();
    expect(screen.getByText(/Избежано кофеина/i)).toBeInTheDocument();
    expect(screen.getByText(/Био-прогресс восстановления организма/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Открыть дневник и график самочувствия')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Открыть книгу знаний: клинический атлас вреда')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Открыть достижения')).toBeInTheDocument();
  });

  it('opens and closes the medical milestone modal on card click', async () => {
    // Seed initial profile in localStorage
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date(Date.now() - 3600000).toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // Click milestone: 'Выведение кофеина и таурина из крови'
    const milestoneCard = screen.getByText('Выведение кофеина и таурина из крови');
    await act(async () => {
      fireEvent.click(milestoneCard);
    });

    // Modal details should be displayed
    expect(screen.getByText(/Что происходит в теле/i)).toBeInTheDocument();
    expect(screen.getByText(/Биохимический механизм/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByText('Понятно');
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    expect(screen.queryByText(/Биохимический механизм/i)).not.toBeInTheDocument();
  });

  it('opens SOS Emergency Modal and interacts with Box Breathing and Urge Surfing', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date(Date.now() - 86400000 * 2).toISOString(), // Day 2
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // Find and click SOS button in header
    const sosBtn = screen.getAllByRole('button', { name: /SOS/i })[0];
    await act(async () => {
      fireEvent.click(sosBtn);
    });

    // SOS modal content verification
    expect(screen.getByText(/Хочу сорваться \/ Острая тяга/i)).toBeInTheDocument();
    expect(screen.getByText(/Дыхание по квадрату 4–4–4/i)).toBeInTheDocument();
    expect(screen.getByText(/Таймер откладывания тяги/i)).toBeInTheDocument();
    expect(screen.getByText(/Дни 2–3 \(Пик синдрома отмены\)/i)).toBeInTheDocument();

    // Interact with Box Breathing
    const breathingStart = screen.getByText('Начать дыхание');
    await act(async () => {
      fireEvent.click(breathingStart);
    });
    expect(screen.getByText('Пауза')).toBeInTheDocument();

    // Close SOS modal
    const closeSos = screen.getByText('Я в порядке, тяга отпустила');
    await act(async () => {
      fireEvent.click(closeSos);
    });

    expect(screen.queryByText(/Хочу сорваться \/ Острая тяга/i)).not.toBeInTheDocument();
  });

  it('submits a daily check-in and records it in history', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date().toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // Open journal modal via header button
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Открыть дневник и график самочувствия'));
    });

    const checkInSubmit = await screen.findByText('Зафиксировать за сегодня');
    await act(async () => {
      fireEvent.click(checkInSubmit);
    });

    expect(await screen.findByText(/Зафиксировано за сегодня/i)).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('zerosurge_checkins') || '[]');
    expect(stored.length).toBe(1);
  });

  it('opens Settings Modal and allows data reset', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date().toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    const settingsBtn = screen.getByLabelText('Настройки профиля');
    await act(async () => {
      fireEvent.click(settingsBtn);
    });

    expect(await screen.findByText('Параметры и профиль')).toBeInTheDocument();
    expect(await screen.findByText(/Сбросить весь прогресс/i)).toBeInTheDocument();

    // Click Reset
    const resetBtn = screen.getByText(/Сбросить весь прогресс/i);
    await act(async () => {
      fireEvent.click(resetBtn);
    });

    // Confirmation dialog appears
    expect(await screen.findByText('Вы уверены?')).toBeInTheDocument();
    const confirmBtn = screen.getByText('Да, сбросить всё');
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    // Storage is cleared and Onboarding modal re-appears
    expect(localStorage.getItem('zerosurge_profile')).toBeNull();
    expect(await screen.findByText('Добро пожаловать в ZeroSurge')).toBeInTheDocument();
  });

  it('opens Relapse Modal from top header and applies penalty upon confirmation', async () => {
    // 36 hours clean = 3 cans avoided at 2 cans/day
    const thirtySixHoursAgo = new Date(Date.now() - 36 * 3600 * 1000).toISOString();
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: thirtySixHoursAgo,
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // 1. Find and click Relapse button in top header
    const relapseBtn = screen.getByRole('button', { name: /зафиксировать срыв|срыв/i });
    expect(relapseBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(relapseBtn);
    });

    // 2. Relapse modal should be visible
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByText('Фиксация срыва')).toBeInTheDocument();

    // 3. Confirm 1 can relapse
    const confirmBtn = screen.getByRole('button', { name: /подтвердить срыв/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    // 4. Modal closes and clean progress is reduced
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    const stored = JSON.parse(localStorage.getItem('zerosurge_profile') || '{}');
    // Original was 36h ago, 1 can penalty (12h) moves it to ~24h ago
    const newElapsedHours = (Date.now() - new Date(stored.quitDate).getTime()) / 3600000;
    expect(newElapsedHours).toBeCloseTo(24, 0);
  });

  it('opens and closes the Caffeine Harm modal from the atlas on the dashboard', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date().toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // 1. Open Harm Atlas modal from header BookOpen button
    const bookBtn = screen.getByLabelText('Открыть книгу знаний: клинический атлас вреда');
    await act(async () => {
      fireEvent.click(bookBtn);
    });

    expect(await screen.findByText('Клинический атлас: Вред стимуляторов')).toBeInTheDocument();

    // 2. Click on cardiovascular system card
    const cardioCard = await screen.findByText('Сердечно-сосудистая система');
    await act(async () => {
      fireEvent.click(cardioCard);
    });

    // 3. Detail modal should appear with clinical mechanism & symptoms
    expect(await screen.findByRole('dialog', { name: /Вазоконстрикция/i })).toBeInTheDocument();
    expect(await screen.findByText(/Биохимический механизм поражения/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Клинические симптомы хронической интоксикации/i)
    ).toBeInTheDocument();
    expect(
      (await screen.findAllByText(/Вазоконстрикция и перегрузка миокарда/i)).length
    ).toBeGreaterThanOrEqual(2);

    // 4. Close the detail modal
    const closeBtn = screen.getByRole('button', { name: /понятно, закрыть справку/i });
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    // 5. Detail modal dismissed
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Вазоконстрикция/i })).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('dialog', { name: /Клинический атлас: Вред стимуляторов/i })
    ).toBeInTheDocument();

    // 6. Close Atlas modal
    const closeAtlasBtn = screen.getByLabelText('Закрыть клинический атлас');
    await act(async () => {
      fireEvent.click(closeAtlasBtn);
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /Клинический атлас: Вред стимуляторов/i })
      ).not.toBeInTheDocument();
    });
  });

  it('toggles performance mode via header lightning button and manages effects/classes', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date(Date.now() - 3600000).toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // Initially performance mode is off
    const toggleBtn = screen.getByLabelText('Отключить эффекты');
    expect(toggleBtn).toBeInTheDocument();
    expect(document.documentElement.classList.contains('performance-mode')).toBe(false);

    // Toggle on (Eco mode)
    await act(async () => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByLabelText('Включить эффекты')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('performance-mode')).toBe(true);
    expect(localStorage.getItem('zero_surge_disable_effects')).toBe('true');

    // Toggle back off
    const activeToggleBtn = screen.getByLabelText('Включить эффекты');
    await act(async () => {
      fireEvent.click(activeToggleBtn);
    });

    expect(screen.getByLabelText('Отключить эффекты')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('performance-mode')).toBe(false);
    expect(localStorage.getItem('zero_surge_disable_effects')).toBe('false');
  });

  it('opens and closes Achievements modal from Header Trophy button', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date(Date.now() - 3600000).toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // Click Trophy button in header
    const trophyBtn = screen.getByLabelText('Открыть достижения');
    await act(async () => {
      fireEvent.click(trophyBtn);
    });

    // Modal dialog should be open with achievements
    expect(await screen.findByRole('dialog', { name: /Система достижений/i })).toBeInTheDocument();
    expect(await screen.findByText(/разблокировано/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByLabelText('Закрыть достижения');
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Система достижений/i })).not.toBeInTheDocument();
    });
  });

  it('opens and closes Health Journal modal from Header Calendar button', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date(Date.now() - 3600000).toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // Click Calendar button in header
    const calendarBtn = screen.getByLabelText('Открыть дневник и график самочувствия');
    await act(async () => {
      fireEvent.click(calendarBtn);
    });

    // Modal dialog should be open with journal and chart
    expect(
      await screen.findByRole('dialog', { name: /Дневник самочувствия и динамика/i })
    ).toBeInTheDocument();
    expect(await screen.findByText(/Как вы чувствуете себя сегодня?/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/График самочувствия и динамики восстановления/i)
    ).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByLabelText('Закрыть дневник');
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /Дневник самочувствия и динамика/i })
      ).not.toBeInTheDocument();
    });
  });

  it('opens edit profile modal from settings and successfully updates profile parameters', async () => {
    localStorage.setItem(
      'zerosurge_profile',
      JSON.stringify({
        quitDate: new Date().toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: true,
      })
    );

    render(<App />);

    // 1. Open Settings modal
    const settingsBtn = screen.getByLabelText('Настройки профиля');
    await act(async () => {
      fireEvent.click(settingsBtn);
    });

    // 2. Click "Изменить стартовые параметры"
    const editBtn = await screen.findByText('Изменить стартовые параметры');
    await act(async () => {
      fireEvent.click(editBtn);
    });

    // 3. Onboarding modal opens in edit mode
    expect(await screen.findByText('Редактирование профиля')).toBeInTheDocument();
    expect(await screen.findByText('Сохранить изменения')).toBeInTheDocument();

    // 4. Submit updated changes
    const saveBtn = screen.getByText('Сохранить изменения');
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    // 5. Returns cleanly to dashboard
    await waitFor(() => {
      expect(screen.queryByText('Редактирование профиля')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Таймер свободы в реальном времени/i)).toBeInTheDocument();
  });
});
