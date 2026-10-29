import React from 'react';
import { AudienceLevel } from '../types';
import { Sparkles, TrendingUp, GraduationCap, Briefcase, Zap, ArrowRight } from 'lucide-react';

interface ScenarioBannerProps {
  currentScenario: string | null;
  onSelectScenario: (scenarioId: string, audience: AudienceLevel, category?: string) => void;
  onClearScenario: () => void;
  onFetchAndSimplifyAll: () => void;
  isSimplifyingBatch: boolean;
}

export const ScenarioBanner: React.FC<ScenarioBannerProps> = ({
  currentScenario,
  onSelectScenario,
  onClearScenario,
  onFetchAndSimplifyAll,
  isSimplifyingBatch,
}) => {
  const scenarios = [
    {
      id: 'scenario-1',
      title: 'Scenario 1: Retail Investor',
      tagline: 'Quickly understand market moves without 20-page Wall St reports',
      audience: 'investor' as AudienceLevel,
      category: 'markets',
      icon: TrendingUp,
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15',
      description: 'Fetch & simplify latest stock market & interest rate developments in under 60 seconds.',
    },
    {
      id: 'scenario-2',
      title: 'Scenario 2: Finance Student',
      tagline: 'Deconstruct complex monetary policy, CPI & yield curve mechanisms',
      audience: 'student' as AudienceLevel,
      category: 'central-banks',
      icon: GraduationCap,
      accent: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/15',
      description: 'Converts technical jargon into accessible economic logic and analogies for studies.',
    },
    {
      id: 'scenario-3',
      title: 'Scenario 3: Busy Executive',
      tagline: '2-minute briefing on crucial business & macro trends before meetings',
      audience: 'executive' as AudienceLevel,
      category: 'tech',
      icon: Briefcase,
      accent: 'border-violet-500/30 text-violet-400 bg-violet-500/10 hover:bg-violet-500/15',
      description: 'High-impact bullet points, revenue/cost impacts, and affected sectors at a glance.',
    },
    {
      id: 'scenario-4',
      title: 'Scenario 4: Market Volatility',
      tagline: 'Rapid digest during sudden price shocks, rate pauses & oil spikes',
      audience: 'beginner' as AudienceLevel,
      category: 'economy',
      icon: Zap,
      accent: 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/15',
      description: 'Immediate breaking alerts and clarity when headlines feel panic-inducing.',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Explore FinNews AI by Real-World Persona
              {currentScenario && (
                <span className="text-xs font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                  Active Preset
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Select a scenario to tailor the AI simplification engine to your exact knowledge level.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentScenario && (
            <button
              onClick={onClearScenario}
              className="text-xs text-slate-400 hover:text-slate-200 underline px-2 py-1"
            >
              Reset Persona
            </button>
          )}

          <button
            onClick={onFetchAndSimplifyAll}
            disabled={isSimplifyingBatch}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimplifyingBatch ? 'animate-spin' : ''}`} />
            <span>{isSimplifyingBatch ? 'Simplifying Feeds...' : 'Fetch & Simplify All'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
        {scenarios.map(s => {
          const Icon = s.icon;
          const isSelected = currentScenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectScenario(s.id, s.audience, s.category)}
              className={`text-left p-3 rounded-xl border transition-all relative ${
                isSelected
                  ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-slate-800/90 shadow-md'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${s.accent}`}>
                  <Icon className="w-3 h-3" />
                  {s.title.split(':')[0]}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">{s.tagline}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {s.description}
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/50">
                <span className="capitalize text-slate-400 font-mono">Audience: {s.audience}</span>
                <span className="flex items-center gap-0.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Activate <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
