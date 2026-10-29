import React from 'react';
import { AudienceLevel } from '../types';
import { X, TrendingUp, GraduationCap, Briefcase, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateScenario: (scenarioId: string, audience: AudienceLevel, category?: string) => void;
}

export const ScenariosModal: React.FC<ScenariosModalProps> = ({
  isOpen,
  onClose,
  onActivateScenario,
}) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'scenario-1',
      title: 'Scenario 1: The Retail Investor',
      subtitle: 'Fast, actionable market clarity without Wall Street obfuscation',
      audience: 'investor' as AudienceLevel,
      category: 'markets',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      problem: 'Retail investors encounter lengthy financial articles riddled with acronyms and hedge-fund jargon.',
      solution: 'Clicks "Fetch & Simplify" to receive concise, jargon-free summaries, sentiment meters (-100 to +100), and a dedicated "What This Means For Your 401(k)" takeaway.',
      primaryFeature: 'Sentiment Score & Retail Investor Playbook',
    },
    {
      id: 'scenario-2',
      title: 'Scenario 2: The Finance Student',
      subtitle: 'Mastering monetary policy, yield curve & inflation mechanisms',
      audience: 'student' as AudienceLevel,
      category: 'central-banks',
      icon: GraduationCap,
      color: 'from-cyan-500 to-blue-500',
      problem: 'College students encounter dense textbook jargon like "quantitative tightening", "r*", and "yield curve inversion".',
      solution: 'FinNews AI translates monetary policy into clear cause-and-effect economic transmission mechanisms, everyday analogies, and interactive comprehension quizzes.',
      primaryFeature: 'Interactive Jargon Decoder & ELI5 Analogies',
    },
    {
      id: 'scenario-3',
      title: 'Scenario 3: The Busy Executive',
      subtitle: '2-minute high-impact economic briefing before meetings',
      audience: 'executive' as AudienceLevel,
      category: 'tech',
      icon: Briefcase,
      color: 'from-violet-500 to-purple-500',
      problem: 'Business leaders lack time to read 15 separate articles before executive strategy meetings.',
      solution: 'Batch "Fetch & Simplify All" provides bulleted takeaways, winners vs losers analysis, and sector operational headwinds/tailwinds in seconds.',
      primaryFeature: 'Executive Bullet Points & Sector Headwinds',
    },
    {
      id: 'scenario-4',
      title: 'Scenario 4: High Market Volatility',
      subtitle: 'Rapid digest during breaking news & market turbulence',
      audience: 'beginner' as AudienceLevel,
      category: 'economy',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      problem: 'During sudden price swings, CPI releases, or Fed decisions, breaking headlines induce panic.',
      solution: 'Instant breaking alerts, live market ticker, audio TTS readout, and calm, objective explanations prevent emotional knee-jerk decisions.',
      primaryFeature: 'Audio TTS News Reader & Breaking News Badges',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              FinNews AI Project Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              Designed according to the core technical brief and user personas.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl bg-gradient-to-tr ${s.color} text-slate-950 font-bold`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{s.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Audience: {s.audience}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-emerald-300">
                      {s.subtitle}
                    </p>

                    <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                      <div>
                        <strong className="text-slate-300">User Pain Point: </strong>
                        {s.problem}
                      </div>
                      <div>
                        <strong className="text-slate-300">FinNews AI Solution: </strong>
                        {s.solution}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Key: {s.primaryFeature}
                    </span>

                    <button
                      onClick={() => {
                        onActivateScenario(s.id, s.audience, s.category);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 transition-all"
                    >
                      <span>Simulate This Persona</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Mentor: Sai Prathyusha Nagilla (prathyusha+mentor@thesmartbridge.com)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
