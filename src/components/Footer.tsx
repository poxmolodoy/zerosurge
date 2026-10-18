import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 pt-6 pb-28 md:pb-8 px-4 text-center text-xs text-slate-500 space-y-3 mt-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-surge-emerald" />
          <span>Все данные надежно сохраняются в вашем браузере (LocalStorage)</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Сделано для здорового ритма сердца и чистого сна</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
        </div>
      </div>

      <p className="max-w-2xl mx-auto text-[11px] text-slate-600 leading-relaxed">
        ZeroSurge основан на клинических данных о фармакокинетике кофеина, регенерации аденозиновых
        рецепторов A1/A2A и нормализации сна. При тяжелых симптомах проконсультируйтесь с врачом.
      </p>
    </footer>
  );
};
