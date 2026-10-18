import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error trapped by ZeroSurge ErrorBoundary:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-glow-ruby">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Что-то пошло не так
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Произошла ошибка при загрузке компонентов или обновилась версия приложения после
                деплоя. Перезагрузите страницу, чтобы продолжить.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-surge-emerald to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-glow-emerald transition-all transform active:scale-95 flex items-center justify-center gap-2"
                aria-label="Перезагрузить страницу"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Перезагрузить страницу</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
