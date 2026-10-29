import React, { useState } from 'react';
import { AudienceLevel, SimplifiedContent } from '../types';
import { X, Sparkles, FileText, GraduationCap, CheckCircle2 } from 'lucide-react';

interface CustomArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomSimplified: (simplified: SimplifiedContent, title: string, text: string) => void;
}

const SAMPLE_ARTICLES = [
  {
    title: 'FOMC Monetary Policy Report: Quantitative Tightening, R-Star & Inflation Persistence',
    audience: 'student' as AudienceLevel,
    text: `The Federal Open Market Committee noted that the natural neutral rate of interest (r*) appears to have drifted higher post-pandemic. Balance sheet runoff under quantitative tightening (QT) has reduced System Open Market Account (SOMA) securities holdings by $1.8 trillion without impairing short-term repo market liquidity. However, term premia fluctuations and sticky non-housing services PCE inflation indicate that the transmission mechanism of restrictive nominal policy rates requires extended calibration. Reverse repurchase facility (ON RRP) balances have dwindled toward baseline friction levels, prompting discussions about tapering the asset runoff speed.`
  },
  {
    title: 'Yield Curve Inversion Deepens as 2Y/10Y Spread Hits Minus 45 Basis Points',
    audience: 'student' as AudienceLevel,
    text: `The benchmark US Treasury 2-year yield climbed to 4.65% while the 10-year sovereign bond yield anchored at 4.20%, extending the yield curve inversion. Historically, inverted term structures signal that bond market participants anticipate a policy-induced recession followed by subsequent central bank easing. Commercial bank margins face acute headwinds as net interest margins (NIMs) contract due to elevated deposit funding costs against fixed-rate legacy asset portfolios.`
  },
  {
    title: 'Quarterly Corporate Earnings: EBITDA Margin Compression Amid Sticky Wage Inputs',
    audience: 'executive' as AudienceLevel,
    text: `Consolidated quarterly filings for industrial conglomerates demonstrate an aggregate 160-basis-point compression in operating EBITDA margins. Unit labor costs expanded by 4.2% annualized, outpacing real top-line price realization. Working capital optimization programs and discretionary capex deferrals were initiated to safeguard free cash flow conversion ratios and maintain investment-grade credit ratings ahead of upcoming debt maturity walls.`
  }
];

export const CustomArticleModal: React.FC<CustomArticleModalProps> = ({
  isOpen,
  onClose,
  onCustomSimplified,
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [audience, setAudience] = useState<AudienceLevel>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectSample = (sample: typeof SAMPLE_ARTICLES[0]) => {
    setTitle(sample.title);
    setText(sample.text);
    setAudience(sample.audience);
    setError(null);
  };

  const handleSimplify = async () => {
    if (!text.trim() || text.trim().length < 20) {
      setError('Please enter at least a few sentences of financial text.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/simplify-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Custom Financial Article',
          rawText: text.trim(),
          audienceLevel: audience,
        }),
      });

      const data = await res.json();
      if (data.data) {
        onCustomSimplified(data.data, title.trim() || 'Custom Financial Article', text.trim());
        onClose();
      } else {
        setError(data.error || 'Failed to simplify the article.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with FinNews AI server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Simplify Custom Financial News or Study Text
              </h3>
              <p className="text-xs text-slate-400">
                Paste any dense report, homework passage, or earnings release (Scenario 2).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Samples */}
          <div>
            <span className="text-xs font-semibold text-slate-300 mb-2 block">
              Or Try A Pre-Loaded Scenario 2 Sample:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_ARTICLES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-850 hover:border-cyan-500/30 text-left transition-all"
                >
                  <div className="text-[11px] font-bold text-cyan-300 line-clamp-1">{s.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{s.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Article Title or Headline (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Federal Reserve Press Conference on Interest Rate Paths"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Target Audience Persona
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['beginner', 'student', 'executive', 'investor'] as AudienceLevel[]).map(aud => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudience(aud)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      audience === aud
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Financial News / Article Text <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={6}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste financial news paragraph, Fed speech, Wall Street research, or economics text..."
                className="w-full p-3.5 text-xs sm:text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono leading-relaxed"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              setTitle('');
              setText('');
              setError(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Clear Fields
          </button>

          <button
            onClick={handleSimplify}
            disabled={isLoading || !text.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Translating & Simplifying...' : 'Simplify with AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
