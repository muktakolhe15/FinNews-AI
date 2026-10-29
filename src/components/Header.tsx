import React, { useEffect, useState } from 'react';
import { Newspaper, Sparkles, BookOpen, Bookmark, FileText, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenCustomModal: () => void;
  onOpenGlossaryModal: () => void;
  onOpenBookmarksModal: () => void;
  onOpenScenariosModal: () => void;
  bookmarksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCustomModal,
  onOpenGlossaryModal,
  onOpenBookmarksModal,
  onOpenScenariosModal,
  bookmarksCount,
}) => {
  const [healthStatus, setHealthStatus] = useState<{
    ok: boolean;
    model: string;
    hasKey: boolean;
  }>({
    ok: true,
    model: 'gemini-3.8-flash',
    hasKey: false,
  });

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealthStatus({
          ok: data.status === 'ok',
          model: data.model || 'gemini-3.8-flash',
          hasKey: data.hasApiKey ?? true,
        });
      })
      .catch(() => {
        setHealthStatus({ ok: true, model: 'gemini-3.8-flash', hasKey: false });
      });
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 shadow-lg shadow-emerald-950/50 text-white font-bold">
              <Newspaper className="w-5 h-5" />
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  FinNews <span className="text-emerald-400 font-extrabold">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Cpu className="w-3 h-3" />
                  {healthStatus.model}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Demystifying Wall Street & Macro Jargon with Generative AI
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenScenariosModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="View how FinNews AI handles the 4 project personas"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Scenarios Guide</span>
              <span className="md:hidden">Guide</span>
            </button>

            <button
              onClick={onOpenGlossaryModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Search financial buzzwords & analogies"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Jargon Decoder</span>
              <span className="sm:hidden">Jargon</span>
            </button>

            <button
              onClick={onOpenCustomModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm transition-all"
              title="Paste your own financial news or homework article"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text / URL</span>
            </button>

            <button
              onClick={onOpenBookmarksModal}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Saved Articles"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
