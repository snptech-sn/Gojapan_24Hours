import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in GoJapan application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error(e);
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 text-[#FF259D] flex items-center justify-center mx-auto text-2xl font-black">
              GJ
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              មានបញ្ហាបច្ចេកទេសក្នុងកម្មវិធី (Application Error)
            </h1>
            <p className="text-sm text-slate-600">
              ប្រព័ន្ធបានជួបប្រទះបញ្ហាមិនរំពឹងទុក។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីដំណើរការឡើងវិញ។
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left font-mono text-xs text-rose-600 overflow-x-auto max-h-36">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2.5 bg-[#FF259D] hover:bg-[#E01485] text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                ផ្ទុកឡើងវិញ (Reload)
              </button>
              <button
                onClick={this.handleResetStorage}
                className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                សម្អាតទិន្នន័យ (Reset Data)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
