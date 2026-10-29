import React from 'react';
import { AudienceLevel } from '../types';
import { Search, RotateCw, Sparkles, Filter, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedAudience: AudienceLevel;
  onAudienceChange: (aud: AudienceLevel) => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalCount: number;
}

const CATEGORIES = [
  { id: 'all', label: 'All Feeds' },
  { id: 'central-banks', label: 'Central Banks & Rates' },
  { id: 'markets', label: 'Stocks & Equities' },
  { id: 'economy', label: 'Economy & CPI' },
  { id: 'tech', label: 'Tech & AI Capex' },
  { id: 'crypto', label: 'Crypto & ETFs' },
  { id: 'commodities', label: 'Energy & Commodities' },
];

const AUDIENCES: { id: AudienceLevel; label: string; icon: string; desc: string }[] = [
  { id: 'beginner', label: 'Beginner / Everyday', icon: '🟢', desc: 'Zero jargon, relatable everyday metaphors' },
  { id: 'student', label: 'Finance Student', icon: '🎓', desc: 'Economic mechanisms & clear definitions' },
  { id: 'executive', label: 'Busy Executive', icon: '💼', desc: 'Bottom-line bullet points & sector impacts' },
  { id: 'investor', label: 'Retail Investor', icon: '📈', desc: 'Portfolio impact, sentiment & risk factors' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedAudience,
  onAudienceChange,
  onRefresh,
  isLoading,
  totalCount,
}) => {
  return (
    <div className="space-y-3.5">
      {/* Top search & audience selector row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search financial news, tickers (e.g. $NVDA, $SPY), interest rates, inflation..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Audience Level Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto shrink-0">
          <span className="text-[11px] font-medium text-slate-400 px-2 hidden sm:inline flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Mode:
          </span>
          {AUDIENCES.map(aud => (
            <button
              key={aud.id}
              onClick={() => onAudienceChange(aud.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedAudience === aud.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              title={aud.desc}
            >
              <span>{aud.icon}</span>
              <span>{aud.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all shrink-0"
          title="Refresh feeds from financial sources"
        >
          <RotateCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Feeds</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 pt-0.5">
        <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Categories:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-100 text-slate-950 font-semibold shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 shrink-0 font-mono hidden md:block">
          Showing {totalCount} {totalCount === 1 ? 'article' : 'articles'}
        </div>
      </div>
    </div>
  );
};
