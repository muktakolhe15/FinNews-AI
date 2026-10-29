import React from 'react';
import { NewsArticle } from '../types';
import { Sparkles, Bookmark, BookmarkCheck, ArrowRight, Clock, ExternalLink, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  onSimplify: (article: NewsArticle) => void;
  onOpenDetails: (article: NewsArticle) => void;
  isSimplifying: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  markets: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  economy: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'central-banks': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  tech: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  crypto: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  commodities: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

const CATEGORY_NAMES: Record<string, string> = {
  markets: 'Stocks & Equities',
  economy: 'Macro Economy',
  'central-banks': 'Monetary Policy',
  tech: 'AI & Tech Capex',
  crypto: 'Digital Assets',
  commodities: 'Commodities',
};

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onSimplify,
  onOpenDetails,
  isSimplifying,
  isBookmarked,
  onToggleBookmark,
}) => {
  const isSimplified = Boolean(article.simplified);

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
        isSimplified
          ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-950/20 hover:border-emerald-500/50'
          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
      }`}
    >
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                CATEGORY_COLORS[article.category] || 'text-slate-400 bg-slate-800 border-slate-700'
              }`}
            >
              {CATEGORY_NAMES[article.category] || article.category}
            </span>

            {article.isBreaking && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                BREAKING
              </span>
            )}

            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {article.readTimeMinutes} min read
            </span>
          </div>

          {/* Bookmark button */}
          <button
            onClick={() => onToggleBookmark(article)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border-slate-800'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Article'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Article Headline */}
        <h3
          onClick={() => (isSimplified ? onOpenDetails(article) : onSimplify(article))}
          className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {article.title}
        </h3>

        {/* Source & Tickers */}
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
          <span>{article.source}</span>
          <span>•</span>
          <span className="font-mono text-slate-500">{article.publishedAt}</span>

          {article.tickers && article.tickers.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 ml-auto">
              {article.tickers.map(t => (
                <span
                  key={t}
                  className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
                >
                  ${t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI Simplified Summary Box or Original Snippet */}
        {isSimplified && article.simplified ? (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                AI Quick Take
              </span>

              {/* Sentiment badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  article.simplified.marketImpact.sentiment === 'Bullish'
                    ? 'text-emerald-300 bg-emerald-500/20'
                    : article.simplified.marketImpact.sentiment === 'Bearish'
                    ? 'text-rose-300 bg-rose-500/20'
                    : 'text-amber-300 bg-amber-500/20'
                }`}
              >
                {article.simplified.marketImpact.sentiment === 'Bullish' && <TrendingUp className="w-2.5 h-2.5" />}
                {article.simplified.marketImpact.sentiment === 'Bearish' && <TrendingDown className="w-2.5 h-2.5" />}
                {article.simplified.marketImpact.sentiment === 'Neutral' && <Minus className="w-2.5 h-2.5" />}
                {article.simplified.marketImpact.sentiment} ({article.simplified.marketImpact.sentimentScore > 0 ? `+${article.simplified.marketImpact.sentimentScore}` : article.simplified.marketImpact.sentimentScore})
              </span>
            </div>

            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {article.simplified.oneLiner}
            </p>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-emerald-400/80">
                {article.simplified.jargonDecoded.length} terms decoded
              </span>
              <span className="capitalize text-slate-400">
                Level: {article.simplified.audienceLevel}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
            {article.originalSnippet}
          </p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>Original Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {isSimplified ? (
          <button
            onClick={() => onOpenDetails(article)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all shadow-sm"
          >
            <span>Open Simplifier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onSimplify(article)}
            disabled={isSimplifying}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSimplifying ? 'animate-spin' : ''}`} />
            <span>{isSimplifying ? 'Simplifying...' : 'Fetch & Simplify'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
