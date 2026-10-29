import React, { useState, useEffect } from 'react';
import { NewsArticle, JargonItem, AudienceLevel } from '../types';
import { speechService } from '../utils/speech';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Send,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Baby,
  Activity,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface SimplifiedModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onSelectTerm: (term: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onReSimplify: (article: NewsArticle, audience: AudienceLevel) => void;
}

type TabType = 'briefing' | 'eli5' | 'jargon' | 'impact' | 'ask' | 'quiz';

export const SimplifiedModal: React.FC<SimplifiedModalProps> = ({
  article,
  onClose,
  onSelectTerm,
  isBookmarked,
  onToggleBookmark,
  onReSimplify,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('briefing');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Q&A state
  const [userQuestion, setUserQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  // Quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  useEffect(() => {
    const unsub = speechService.subscribe(speaking => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
      speechService.stop();
    };
  }, []);

  useEffect(() => {
    // Reset state on article change
    setActiveTab('briefing');
    setChatMessages([]);
    setUserQuestion('');
    setSelectedQuizAnswer(null);
    setShowQuizResult(false);
    speechService.stop();
  }, [article?.id]);

  if (!article || !article.simplified) return null;

  const content = article.simplified;

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      const readText = `FinNews AI Briefing: ${content.headline}. In one sentence: ${content.oneLiner}. Key points: ${content.keyTakeaways.join('. ')}. In summary: ${content.summary}`;
      speechService.speak(readText, speechRate);
    }
  };

  const handleCopySummary = () => {
    const textToCopy = `FinNews AI Summary: ${content.headline}
One-Liner: ${content.oneLiner}

Summary:
${content.summary}

Key Takeaways:
${content.keyTakeaways.map(t => `• ${t}`).join('\n')}

Market Sentiment: ${content.marketImpact.sentiment} (${content.marketImpact.sentimentScore > 0 ? `+` : ''}${content.marketImpact.sentimentScore})
Retail Investor Note: ${content.marketImpact.retailInvestorTakeaway}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendQuestion = async (customQ?: string) => {
    const q = customQ || userQuestion;
    if (!q.trim() || isAsking) return;

    setUserQuestion('');
    setChatMessages(prev => [...prev, { role: 'user', text: q }]);
    setIsAsking(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleTitle: article.title,
          articleSummary: content.summary,
          question: q,
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: 'This development mainly shifts near-term expectations for borrowing costs and valuation multiples. For retail investors, avoiding knee-jerk moves and focusing on long-term diversification remains paramount.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Simplified by FinNews AI
                </span>
                <span className="text-slate-500 font-mono">•</span>
                <span className="text-slate-400 capitalize">Audience: {content.audienceLevel}</span>
                <span className="text-slate-500 font-mono">•</span>
                <span className="text-slate-400 font-mono">{article.source}</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
                {content.headline}
              </h2>

              <p className="text-xs text-slate-400 line-clamp-1 italic">
                Original: "{article.title}"
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Row: Audio TTS, Copy, Bookmark, Original */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Audio Readout Controls */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  isSpeaking ? 'text-amber-400' : 'text-slate-200 hover:text-white'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen to Briefing'}</span>
              </button>

              <div className="h-3 w-px bg-slate-700" />

              <button
                onClick={() => {
                  const nextRate = speechRate === 1.0 ? 1.25 : speechRate === 1.25 ? 0.8 : 1.0;
                  setSpeechRate(nextRate);
                }}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 px-1"
                title="Change Audio Speed"
              >
                {speechRate}x
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(article)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
              >
                <span>Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto shrink-0">
          {[
            { id: 'briefing', label: 'Plain English Briefing', icon: BookOpen },
            { id: 'eli5', label: "Explain Like I'm 5", icon: Baby },
            { id: 'jargon', label: `Jargon Decoder (${content.jargonDecoded.length})`, icon: Sparkles },
            { id: 'impact', label: 'Market Impact & Sentiment', icon: Activity },
            { id: 'ask', label: 'Ask AI Follow-Up', icon: MessageSquare },
            { id: 'quiz', label: 'Quiz', icon: HelpCircle },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: BRIEFING */}
          {activeTab === 'briefing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* One-Liner Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  In 1 Sentence (The Bottom Line)
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                  {content.oneLiner}
                </p>
              </div>

              {/* Key Takeaways */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Key Takeaways
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.keyTakeaways.map((takeaway, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 flex items-start gap-3 text-xs leading-relaxed text-slate-200"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[11px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plain English Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  The Full Story, Decoded
                </h4>
                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4 font-sans">
                  {content.summary}
                </div>
              </div>

              {/* Retail Investor Takeaway */}
              <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    What This Means For Your 401(k) & Pocketbook
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {content.marketImpact.retailInvestorTakeaway}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELI5 */}
          {activeTab === 'eli5' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base text-amber-300">Explain Like I'm 5 (ELI5)</h3>
                    <p className="text-xs text-slate-400 font-normal">
                      A simple, vivid real-world metaphor for complete beginners.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm sm:text-base leading-relaxed text-slate-100 italic font-serif">
                  "{content.eli5}"
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold">Takeaway:</span>
                  <span>Financial markets follow human psychology and simple supply and demand.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JARGON DECODER */}
          {activeTab === 'jargon' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Jargon Detected in This Story
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click any term to understand its precise meaning and memorable analogy.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.jargonDecoded.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {item.term}
                      </span>
                      <button
                        onClick={() => onSelectTerm(item.term)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                      >
                        Explore More
                      </button>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-slate-100">Plain Definition: </strong>
                      {item.definition}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-amber-200/90 leading-relaxed">
                      <strong className="text-amber-400 block mb-0.5">Simple Analogy:</strong>
                      {item.simpleAnalogy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MARKET IMPACT & SENTIMENT */}
          {activeTab === 'impact' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Sentiment meter */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Overall Market Sentiment
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xl font-extrabold ${
                          content.marketImpact.sentiment === 'Bullish'
                            ? 'text-emerald-400'
                            : content.marketImpact.sentiment === 'Bearish'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {content.marketImpact.sentiment}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (Confidence Score: {content.marketImpact.sentimentScore > 0 ? `+${content.marketImpact.sentimentScore}` : content.marketImpact.sentimentScore} / 100)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    {content.marketImpact.sentiment === 'Bullish' && <TrendingUp className="w-6 h-6 text-emerald-400" />}
                    {content.marketImpact.sentiment === 'Bearish' && <TrendingDown className="w-6 h-6 text-rose-400" />}
                    {content.marketImpact.sentiment === 'Neutral' && <Minus className="w-6 h-6 text-amber-400" />}
                  </div>
                </div>

                {/* Progress bar gauge */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{
                        width: `${Math.max(0, -content.marketImpact.sentimentScore)}%`,
                      }}
                    />
                    <div
                      className="bg-emerald-500 h-full ml-auto transition-all duration-500"
                      style={{
                        width: `${Math.max(0, content.marketImpact.sentimentScore)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Bearish (-100)</span>
                    <span>Neutral (0)</span>
                    <span>Bullish (+100)</span>
                  </div>
                </div>
              </div>

              {/* Affected Sectors */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Affected Sectors & Asset Classes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.marketImpact.affectedSectors.map((sector, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              {/* Who Wins vs Who Loses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Winners */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <TrendingUp className="w-4 h-4" /> Who Wins
                  </h5>
                  <ul className="space-y-1.5">
                    {content.marketImpact.whoWins.map((item, i) => (
                      <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Losers */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/25 space-y-2">
                  <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <TrendingDown className="w-4 h-4" /> Who Loses / Faces Headwinds
                  </h5>
                  <ul className="space-y-1.5">
                    {content.marketImpact.whoLoses.map((item, i) => (
                      <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ASK AI FOLLOW-UP */}
          {activeTab === 'ask' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h4 className="text-sm font-bold text-slate-200">
                  Ask FinNews AI About This News
                </h4>
                <p className="text-xs text-slate-400">
                  Ask anything about how this impacts your money, specific companies, or the broader economy.
                </p>
              </div>

              {/* Preset prompt pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  'What does this mean for mortgage rates?',
                  'Will this cause stock prices to fall?',
                  'How does this affect high-yield savings accounts?',
                  'Explain this using an analogy for a student',
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendQuestion(preset)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>

              {/* Chat thread */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 min-h-[200px] max-h-[300px] overflow-y-auto space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No questions asked yet. Type below or click one of the suggested prompts above!
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 mb-0.5">
                        {msg.role === 'user' ? 'You' : 'FinNews AI'}
                      </span>
                      <div
                        className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-slate-850 text-slate-200 border border-slate-700/80 rounded-bl-none whitespace-pre-line'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {isAsking && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 py-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>FinNews AI is analyzing your question...</span>
                  </div>
                )}
              </div>

              {/* Input box */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendQuestion();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={userQuestion}
                  onChange={e => setUserQuestion(e.target.value)}
                  placeholder="Ask a question about this article..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  type="submit"
                  disabled={!userQuestion.trim() || isAsking}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: QUIZ */}
          {activeTab === 'quiz' && content.quickQuiz && (
            <div className="space-y-4 animate-in fade-in duration-200 max-w-xl mx-auto">
              <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  Test Your Understanding
                </div>

                <h4 className="text-base font-bold text-slate-100">
                  {content.quickQuiz.question}
                </h4>

                <div className="space-y-2 pt-2">
                  {content.quickQuiz.options.map((opt, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrect = idx === content.quickQuiz!.correctIndex;
                    let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                    if (showQuizResult) {
                      if (isCorrect) {
                        style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
                      } else if (isSelected) {
                        style = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                      }
                    } else if (isSelected) {
                      style = 'bg-emerald-500/15 border-emerald-500 text-emerald-300';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!showQuizResult) {
                            setSelectedQuizAnswer(idx);
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${style}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-mono">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!showQuizResult ? (
                  <button
                    onClick={() => {
                      if (selectedQuizAnswer !== null) {
                        setShowQuizResult(true);
                      }
                    }}
                    disabled={selectedQuizAnswer === null}
                    className="w-full mt-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-40"
                  >
                    Check My Answer
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mt-4">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {selectedQuizAnswer === content.quickQuiz.correctIndex ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Correct! Outstanding comprehension.
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Not quite, but here is the logic:
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {content.quickQuiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Switcher */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Re-simplify for another persona:</span>
            {(['beginner', 'student', 'executive', 'investor'] as AudienceLevel[]).map(aud => (
              <button
                key={aud}
                onClick={() => onReSimplify(article, aud)}
                className={`capitalize px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                  content.audienceLevel === aud
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border-slate-700'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
