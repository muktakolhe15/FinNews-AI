import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

interface JargonDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string | null;
}

interface TermDetail {
  term: string;
  simpleDefinition: string;
  analogy: string;
  whyItMatters: string;
}

const BUILT_IN_TERMS: TermDetail[] = [
  {
    term: 'Yield Curve Inversion',
    simpleDefinition: 'When short-term government bonds pay higher interest rates than long-term bonds, turning the normal relationship upside down.',
    analogy: 'Imagine if lending a friend $100 for 1 week gave you $10 interest, but locking up your money for 10 years only gave you $2. It signals that people expect bad economic weather ahead.',
    whyItMatters: 'Historically, an inverted yield curve has been one of Wall Street’s most reliable warning lights for an upcoming recession.'
  },
  {
    term: 'Quantitative Easing (QE)',
    simpleDefinition: 'When a central bank creates new digital money to purchase government bonds from banks, injecting cash into the economy.',
    analogy: 'Like watering a parched lawn with a high-pressure hose. It revives economic activity, but too much water causes flooding (inflation).',
    whyItMatters: 'Makes borrowing cheaper for mortgages, cars, and business loans, boosting stock and real estate prices.'
  },
  {
    term: 'Quantitative Tightening (QT)',
    simpleDefinition: 'The exact opposite of QE: the central bank stops buying bonds and lets its bond holdings expire, sucking cash out of the system.',
    analogy: 'Like turning off the lawn sprinkler and letting the soil dry up so inflation doesn’t create weeds.',
    whyItMatters: 'Puts upward pressure on borrowing costs and tests financial market plumbing.'
  },
  {
    term: 'Basis Point (BPS)',
    simpleDefinition: 'A unit equal to one-hundredth of a percentage point (0.01% or 0.0001).',
    analogy: 'Like cents to a dollar: 100 basis points equal exactly 1.00% interest.',
    whyItMatters: 'Central bankers raise or lower rates in 25 bps or 50 bps increments, which moves mortgage payments by hundreds of dollars.'
  },
  {
    term: 'EBITDA',
    simpleDefinition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization—a measure of a company’s raw operating cash generation.',
    analogy: 'Like looking at a bakery’s profits purely from selling cakes and bread, before paying off the bakery loan, the taxman, or buying new ovens.',
    whyItMatters: 'Allows analysts to compare companies across different tax jurisdictions and capital debt structures.'
  },
  {
    term: 'Stagflation',
    simpleDefinition: 'A toxic combination of stagnant economic growth, high unemployment, and stubborn high inflation.',
    analogy: 'Like a car stuck in thick mud with the engine overheating and the gas gauge dropping rapidly.',
    whyItMatters: 'The worst nightmare for policymakers because raising rates hurts jobs, but cutting rates worsens inflation.'
  },
  {
    term: 'Owner Equivalent Rent (OER)',
    simpleDefinition: 'The theoretical rent a homeowner would pay to rent their own house, used by the government to measure shelter inflation.',
    analogy: 'Asking yourself: "If I didn’t own this house and had to rent it from a landlord tonight, what would the going rate be?"',
    whyItMatters: 'Makes up roughly 25% of the entire Consumer Price Index (CPI), so its "stickiness" delays Fed rate cuts.'
  },
  {
    term: 'Disinflation vs Deflation',
    simpleDefinition: 'Disinflation is prices still rising, but at a slower speed. Deflation is prices actually falling below zero.',
    analogy: 'Disinflation is a speeding car slowing from 90 mph to 40 mph. Deflation is putting the car into reverse.',
    whyItMatters: 'Disinflation is healthy; broad deflation can trigger corporate wage cuts and debt defaults.'
  }
];

export const JargonDictionaryModal: React.FC<JargonDictionaryModalProps> = ({
  isOpen,
  onClose,
  initialTerm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<TermDetail | null>(null);
  const [isDecodingAi, setIsDecodingAi] = useState(false);

  useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
      const found = BUILT_IN_TERMS.find(t => t.term.toLowerCase() === initialTerm.toLowerCase());
      if (found) {
        setSelectedTerm(found);
      } else {
        handleAiDecode(initialTerm);
      }
    } else {
      setSelectedTerm(BUILT_IN_TERMS[0]);
    }
  }, [initialTerm, isOpen]);

  if (!isOpen) return null;

  const filteredTerms = BUILT_IN_TERMS.filter(t =>
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAiDecode = async (customTerm?: string) => {
    const termToQuery = customTerm || searchTerm;
    if (!termToQuery.trim()) return;

    setIsDecodingAi(true);
    try {
      const res = await fetch('/api/explain-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: termToQuery }),
      });
      const data = await res.json();
      setSelectedTerm({
        term: data.term || termToQuery,
        simpleDefinition: data.simpleDefinition || 'Core financial market mechanism.',
        analogy: data.analogy || 'Like supply and demand at your local market.',
        whyItMatters: data.whyItMatters || 'Determines interest rates and investment returns.',
      });
    } catch {
      setSelectedTerm({
        term: termToQuery,
        simpleDefinition: 'Important financial terminology.',
        analogy: 'Similar to balancing income and expenditures.',
        whyItMatters: 'Affects how assets and loans are priced.',
      });
    } finally {
      setIsDecodingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                FinNews AI Jargon Decoder & Dictionary
              </h3>
              <p className="text-xs text-slate-400">
                Understand the complex Wall Street buzzwords without feeling intimidated.
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

        {/* Search Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search or type any financial buzzword (e.g. 'Hawkish', 'Repo', 'Short Squeeze')..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <button
            onClick={() => handleAiDecode()}
            disabled={!searchTerm.trim() || isDecodingAi}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-40 shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDecodingAi ? 'animate-spin' : ''}`} />
            <span>{isDecodingAi ? 'Decoding...' : 'AI Decode Term'}</span>
          </button>
        </div>

        {/* Content Split Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Term List Sidebar */}
          <div className="border-r border-slate-800 p-3 overflow-y-auto space-y-1.5 max-h-[300px] md:max-h-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
              Popular Financial Concepts
            </span>
            {filteredTerms.map((t, idx) => {
              const isSelected = selectedTerm?.term === t.term;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTerm(t)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-mono">{t.term}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {t.simpleDefinition}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Term Card */}
          <div className="md:col-span-2 p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-900/50">
            {selectedTerm ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
                    <span className="text-emerald-400">{selectedTerm.term}</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Decoded
                  </span>
                </div>

                {/* Definition */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Plain English Definition
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    {selectedTerm.simpleDefinition}
                  </p>
                </div>

                {/* Real-World Analogy */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    The Everyday Metaphor (ELI5)
                  </span>
                  <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25 italic">
                    "{selectedTerm.analogy}"
                  </p>
                </div>

                {/* Why it matters */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Why It Matters To You
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    {selectedTerm.whyItMatters}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Select a term on the left or use the AI decoder above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
