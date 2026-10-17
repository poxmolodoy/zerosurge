import { useState } from 'react';
import { TrendingUp, Zap, Moon, Flame, HelpCircle } from 'lucide-react';
import { DailyCheckIn } from '../types';

interface FeelingChartProps {
  checkIns: DailyCheckIn[];
}

// Typical scientific recovery model based on caffeine withdrawal studies (Days 1 to 14)
const BENCHMARK_DATA: { day: string; energy: number; sleep: number; craving: number }[] = [
  { day: 'День 1', energy: 2.2, sleep: 2.0, craving: 4.8 },
  { day: 'День 2', energy: 1.8, sleep: 2.3, craving: 5.0 },
  { day: 'День 3', energy: 2.0, sleep: 2.8, craving: 4.5 },
  { day: 'День 4', energy: 2.9, sleep: 3.4, craving: 3.2 },
  { day: 'День 5', energy: 3.5, sleep: 3.8, craving: 2.5 },
  { day: 'День 7', energy: 4.0, sleep: 4.3, craving: 1.8 },
  { day: 'День 10', energy: 4.4, sleep: 4.6, craving: 1.3 },
  { day: 'День 14', energy: 4.8, sleep: 4.9, craving: 1.0 },
];

export const FeelingChart: React.FC<FeelingChartProps> = ({ checkIns }) => {
  const [useBenchmark, setUseBenchmark] = useState<boolean>(checkIns.length < 2);
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    energy: number;
    sleep: number;
    craving: number;
    x: number;
    y: number;
  } | null>(null);

  // Determine which data to plot
  const data =
    useBenchmark || checkIns.length === 0
      ? BENCHMARK_DATA
      : checkIns.map((c, i) => ({
          day: `День ${i + 1}`,
          energy: c.energy,
          sleep: c.sleep,
          craving: c.craving,
        }));

  // SVG dimensions & margins
  const width = 600;
  const height = 240;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const pointsCount = data.length;
  const getX = (index: number) => {
    if (pointsCount <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (pointsCount - 1)) * chartWidth;
  };

  // Score from 1 to 5 mapped to chart height
  const getY = (val: number) => {
    const clamped = Math.max(1, Math.min(5, val));
    return paddingTop + chartHeight - ((clamped - 1) / 4) * chartHeight;
  };

  // Generate SVG path strings
  const generatePath = (key: 'energy' | 'sleep' | 'craving') => {
    if (data.length === 0) return '';
    return data.reduce((acc, curr, idx) => {
      const x = getX(idx);
      const y = getY(curr[key]);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const energyPath = generatePath('energy');
  const sleepPath = generatePath('sleep');
  const cravingPath = generatePath('craving');

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-surge-emerald" />
            График самочувствия и динамики восстановления
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Наглядная кривая роста натуральной энергии и спада тяги к стимуляторам
          </p>
        </div>

        {/* Toggle between user data and scientific model */}
        {checkIns.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setUseBenchmark(false)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                !useBenchmark
                  ? 'bg-surge-emerald text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Мои записи ({checkIns.length})
            </button>
            <button
              type="button"
              onClick={() => setUseBenchmark(true)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                useBenchmark
                  ? 'bg-surge-cyan text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Научная модель
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-surge-cyan">
          <span className="w-3 h-3 rounded-full bg-surge-cyan"></span>
          <Zap className="w-3.5 h-3.5" /> Натуральная энергия
        </div>
        <div className="flex items-center gap-1.5 text-surge-emerald">
          <span className="w-3 h-3 rounded-full bg-surge-emerald"></span>
          <Moon className="w-3.5 h-3.5" /> Качество сна
        </div>
        <div className="flex items-center gap-1.5 text-surge-amber">
          <span className="w-3 h-3 rounded-full bg-surge-amber"></span>
          <Flame className="w-3.5 h-3.5" /> Тяга к стимуляторам
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full bg-slate-950/40 rounded-2xl p-2 sm:p-4 border border-white/5">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Horizontal Grid lines (1 to 5) */}
          {[1, 2, 3, 4, 5].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Vertical axis line */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="rgba(255, 255, 255, 0.15)"
          />

          {/* Vertical guideline for currently hovered day */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingTop}
              x2={hoveredPoint.x}
              y2={height - paddingBottom}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeDasharray="3 3"
              pointerEvents="none"
            />
          )}

          {/* Lines */}
          {/* 1. Craving Line */}
          <path
            d={cravingPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
          />

          {/* 2. Sleep Line */}
          <path
            d={sleepPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          />

          {/* 3. Energy Line */}
          <path
            d={energyPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          />

          {/* Data Points */}
          {data.map((item, idx) => {
            const x = getX(idx);
            const yEnergy = getY(item.energy);
            const ySleep = getY(item.sleep);
            const yCraving = getY(item.craving);

            return (
              <g key={idx}>
                {/* X-axis labels */}
                <text
                  x={x}
                  y={height - paddingBottom + 18}
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {item.day}
                </text>

                {/* Point dots */}
                {/* 1. Energy Point */}
                <circle
                  cx={x}
                  cy={yEnergy}
                  r={hoveredPoint?.label === item.day && hoveredPoint.y === yEnergy ? 5.5 : 4}
                  fill="#06B6D4"
                  stroke={
                    hoveredPoint?.label === item.day && hoveredPoint.y === yEnergy
                      ? '#FFFFFF'
                      : 'none'
                  }
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      label: item.day,
                      energy: item.energy,
                      sleep: item.sleep,
                      craving: item.craving,
                      x,
                      y: yEnergy,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* 2. Sleep Point */}
                <circle
                  cx={x}
                  cy={ySleep}
                  r={hoveredPoint?.label === item.day && hoveredPoint.y === ySleep ? 5.5 : 3.5}
                  fill="#10B981"
                  stroke={
                    hoveredPoint?.label === item.day && hoveredPoint.y === ySleep
                      ? '#FFFFFF'
                      : 'none'
                  }
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      label: item.day,
                      energy: item.energy,
                      sleep: item.sleep,
                      craving: item.craving,
                      x,
                      y: ySleep,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* 3. Craving Point */}
                <circle
                  cx={x}
                  cy={yCraving}
                  r={hoveredPoint?.label === item.day && hoveredPoint.y === yCraving ? 5.5 : 3.5}
                  fill="#F59E0B"
                  stroke={
                    hoveredPoint?.label === item.day && hoveredPoint.y === yCraving
                      ? '#FFFFFF'
                      : 'none'
                  }
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      label: item.day,
                      energy: item.energy,
                      sleep: item.sleep,
                      craving: item.craving,
                      x,
                      y: yCraving,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay with boundary-safe directional alignment */}
        {hoveredPoint &&
          (() => {
            const isLeft = hoveredPoint.x < width * 0.28;
            const isRight = hoveredPoint.x > width * 0.72;
            const isTop = hoveredPoint.y < 100;

            const transformClass = isLeft
              ? isTop
                ? 'translate-x-2 translate-y-3'
                : 'translate-x-2 -translate-y-full -translate-y-2'
              : isRight
                ? isTop
                  ? '-translate-x-full -translate-x-2 translate-y-3'
                  : '-translate-x-full -translate-x-2 -translate-y-full -translate-y-2'
                : isTop
                  ? '-translate-x-1/2 translate-y-3'
                  : '-translate-x-1/2 -translate-y-full -translate-y-2';

            return (
              <div
                className={`absolute z-30 pointer-events-none p-2.5 sm:p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-white/20 text-xs shadow-2xl space-y-1 transform whitespace-nowrap min-w-[130px] ${transformClass}`}
                style={{
                  left: `${(hoveredPoint.x / width) * 100}%`,
                  top: `${(hoveredPoint.y / height) * 100}%`,
                }}
              >
                <div className="font-bold text-white border-b border-white/10 pb-1 mb-1 flex items-center justify-between gap-2">
                  <span>{hoveredPoint.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">динамика</span>
                </div>
                <div className="text-surge-cyan font-mono flex items-center gap-1.5">
                  <span>⚡ Энергия:</span>
                  <span className="font-bold ml-auto">{hoveredPoint.energy}</span>
                </div>
                <div className="text-surge-emerald font-mono flex items-center gap-1.5">
                  <span>🌙 Сон:</span>
                  <span className="font-bold ml-auto">{hoveredPoint.sleep}</span>
                </div>
                <div className="text-surge-amber font-mono flex items-center gap-1.5">
                  <span>🔥 Тяга:</span>
                  <span className="font-bold ml-auto">{hoveredPoint.craving}</span>
                </div>
              </div>
            );
          })()}
      </div>

      {/* Crossover Insight */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
        <HelpCircle className="w-4 h-4 text-surge-cyan shrink-0 mt-0.5" />
        <span>
          <strong>Динамика синдрома отмены (Juliano & Griffiths, 2004):</strong> Пик симптомов
          абстиненции (головная боль, упадок сил, тяга) приходится на 20–51 час (1–2 сутки), а к 3–4
          дню острые проявления стихают, уступая место росту естественной энергии и глубины сна.
        </span>
      </div>
    </div>
  );
};
