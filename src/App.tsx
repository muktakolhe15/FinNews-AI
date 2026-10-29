import React, { useState, useEffect } from 'react';
import { NewsArticle, AudienceLevel, SimplifiedContent } from './types';
import { Header } from './components/Header';
import { MarketTicker } from './components/MarketTicker';
import { ScenarioBanner } from './components/ScenarioBanner';
import { FilterBar } from './components/FilterBar';
import { NewsCard } from './components/NewsCard';
import { SimplifiedModal } from './components/SimplifiedModal';
import { CustomArticleModal } from './components/CustomArticleModal';
import { JargonDictionaryModal } from './components/JargonDictionaryModal';
import { ScenariosModal } from './components/ScenariosModal';
import { BookmarksModal } from './components/BookmarksModal';
import { Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<AudienceLevel>('beginner');
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);

  // Modals state
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [simplifyingId, setSimplifyingId] = useState<string | null>(null);
  const [isSimplifyingBatch, setIsSimplifyingBatch] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState<boolean>(false);
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState<boolean>(false);
  const [isScenariosModalOpen, setIsScenariosModalOpen] = useState<boolean>(false);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('finnews_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('finnews_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Error saving bookmarks', e);
    }
  }, [bookmarks]);

  // Fetch News from backend
  const fetchNews = async () => {
    setIsLoadingNews(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      if (data.articles) {
        // Retain existing simplifications if any
        setArticles(prev => {
          const simplifiedMap = new Map(prev.filter(a => a.simplified).map(a => [a.id, a.simplified]));
          return data.articles.map((item: NewsArticle) => ({
            ...item,
            simplified: simplifiedMap.get(item.id) || item.simplified,
          }));
        });
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  // Simplify a specific article
  const handleSimplifyArticle = async (article: NewsArticle, overrideAudience?: AudienceLevel) => {
    setSimplifyingId(article.id);
    const audience = overrideAudience || selectedAudience;

    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          title: article.title,
          articleText: article.fullText || article.originalSnippet,
          audienceLevel: audience,
        }),
      });

      const data = await res.json();
      if (data.data) {
        const updatedArticle = {
          ...article,
          simplified: data.data as SimplifiedContent,
        };

        setArticles(prev => prev.map(a => (a.id === article.id ? updatedArticle : a)));
        setActiveArticle(updatedArticle);
        showToast(`Article successfully simplified for ${audience} level!`);
      }
    } catch (err) {
      console.error('Error simplifying article:', err);
      showToast('Could not simplify article. Please try again.');
    } finally {
      setSimplifyingId(null);
    }
  };

  // Batch Simplify All (Scenario 1 & 3: Fast complete market briefing)
  const handleFetchAndSimplifyAll = async () => {
    setIsSimplifyingBatch(true);
    showToast('Fetching and simplifying all feed headlines with AI...');

    try {
      const unsimplified = articles.filter(a => !a.simplified);
      const targets = unsimplified.length > 0 ? unsimplified.slice(0, 4) : articles.slice(0, 4);

      for (const item of targets) {
        const res = await fetch('/api/simplify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId: item.id,
            title: item.title,
            articleText: item.fullText || item.originalSnippet,
            audienceLevel: selectedAudience,
          }),
        });
        const data = await res.json();
        if (data.data) {
          setArticles(prev =>
            prev.map(a => (a.id === item.id ? { ...a, simplified: data.data } : a))
          );
        }
      }
      showToast(`Simplified articles across all sectors!`);
    } catch (err) {
      console.error('Error during batch simplification:', err);
    } finally {
      setIsSimplifyingBatch(false);
    }
  };

  // Handle custom simplified article (Scenario 2)
  const handleCustomSimplified = (simplified: SimplifiedContent, customTitle: string, customText: string) => {
    const customArticle: NewsArticle = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      source: 'Custom / Study Material',
      url: '#',
      publishedAt: 'Just now',
      category: 'central-banks',
      originalSnippet: customText.slice(0, 240) + '...',
      fullText: customText,
      readTimeMinutes: Math.max(1, Math.ceil(customText.split(' ').length / 180)),
      isBreaking: false,
      simplified,
    };

    setArticles(prev => [customArticle, ...prev]);
    setActiveArticle(customArticle);
    showToast('Custom article simplified successfully!');
  };

  // Scenario activation
  const handleSelectScenario = (scenarioId: string, audience: AudienceLevel, category?: string) => {
    setCurrentScenario(scenarioId);
    setSelectedAudience(audience);
    if (category) {
      setSelectedCategory(category);
    }
    showToast(`Activated ${scenarioId.replace('-', ' ')} mode: Audience set to ${audience}`);
  };

  const handleClearScenario = () => {
    setCurrentScenario(null);
    setSelectedCategory('all');
    setSelectedAudience('beginner');
  };

  // Bookmarks toggle
  const handleToggleBookmark = (article: NewsArticle) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === article.id);
      if (exists) {
        showToast('Removed from saved bookmarks');
        return prev.filter(b => b.id !== article.id);
      } else {
        showToast('Saved to bookmarks!');
        return [article, ...prev];
      }
    });
  };

  const handleOpenTermInGlossary = (term: string) => {
    setGlossaryTerm(term);
    setIsGlossaryModalOpen(true);
  };

  const filteredArticles = articles.filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.originalSnippet.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q) ||
      a.tickers?.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenGlossaryModal={() => {
          setGlossaryTerm(null);
          setIsGlossaryModalOpen(true);
        }}
        onOpenBookmarksModal={() => setIsBookmarksModalOpen(true)}
        onOpenScenariosModal={() => setIsScenariosModalOpen(true)}
        bookmarksCount={bookmarks.length}
      />

      {/* Live Market Indices Ticker */}
      <MarketTicker />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Scenario Persona Guide Banner */}
        <ScenarioBanner
          currentScenario={currentScenario}
          onSelectScenario={handleSelectScenario}
          onClearScenario={handleClearScenario}
          onFetchAndSimplifyAll={handleFetchAndSimplifyAll}
          isSimplifyingBatch={isSimplifyingBatch}
        />

        {/* Filter and Audience Toolbar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedAudience={selectedAudience}
          onAudienceChange={setSelectedAudience}
          onRefresh={fetchNews}
          isLoading={isLoadingNews}
          totalCount={filteredArticles.length}
        />

        {/* News Feed Grid */}
        {isLoadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-slate-900/40 border border-slate-800/80 animate-pulse p-5 space-y-4"
              >
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-16 bg-slate-800/60 rounded" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No financial news matching your criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms, changing the category filter, or pasting your own custom article text.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                onSimplify={handleSimplifyArticle}
                onOpenDetails={setActiveArticle}
                isSimplifying={simplifyingId === article.id}
                isBookmarked={bookmarks.some(b => b.id === article.id)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">FinNews AI</span>
            <span>– Financial News Simplifier</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-400 border border-slate-800 font-mono">
              v1.0.0
            </span>
          </div>

          <div className="text-center sm:text-right">
            <span>Powered by Large Language Models & Financial Intelligence</span>
            <span className="mx-2">•</span>
            <span className="text-slate-400">Informational use only, not financial advice</span>
          </div>
        </div>
      </footer>

      {/* Modal 1: Detailed Simplified Article Modal */}
      <SimplifiedModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        onSelectTerm={handleOpenTermInGlossary}
        isBookmarked={activeArticle ? bookmarks.some(b => b.id === activeArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onReSimplify={(art, aud) => handleSimplifyArticle(art, aud)}
      />

      {/* Modal 2: Custom Article Simplifier (Scenario 2) */}
      <CustomArticleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onCustomSimplified={handleCustomSimplified}
      />

      {/* Modal 3: Jargon Dictionary & AI Decoder */}
      <JargonDictionaryModal
        isOpen={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
        initialTerm={glossaryTerm}
      />

      {/* Modal 4: Scenarios Guide Walkthrough */}
      <ScenariosModal
        isOpen={isScenariosModalOpen}
        onClose={() => setIsScenariosModalOpen(false)}
        onActivateScenario={handleSelectScenario}
      />

      {/* Modal 5: Saved Bookmarks */}
      <BookmarksModal
        isOpen={isBookmarksModalOpen}
        onClose={() => setIsBookmarksModalOpen(false)}
        bookmarks={bookmarks}
        onOpenArticle={article => setActiveArticle(article)}
        onRemoveBookmark={id => setBookmarks(prev => prev.filter(b => b.id !== id))}
        onClearAll={() => setBookmarks([])}
      />
    </div>
  );
}
