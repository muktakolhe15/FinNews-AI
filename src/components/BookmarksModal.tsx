import React from 'react';
import { NewsArticle } from '../types';
import { X, Bookmark, Trash2, ArrowRight, Sparkles, Clock } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: NewsArticle[];
  onOpenArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (articleId: string) => void;
  onClearAll: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onOpenArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Saved Financial Articles ({bookmarks.length})
              </h3>
              <p className="text-xs text-slate-400">
                Your offline & bookmarked news simplifications for review.
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

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">No saved articles yet.</p>
              <p className="text-xs text-slate-500">
                Click the bookmark icon on any financial news card to save it here for later.
              </p>
            </div>
          ) : (
            bookmarks.map(article => (
              <div
                key={article.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="capitalize text-emerald-400 font-medium">{article.category}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 font-mono">
                      <Clock className="w-3 h-3" />
                      {article.readTimeMinutes}m
                    </span>
                  </div>

                  <h4
                    onClick={() => {
                      onOpenArticle(article);
                      onClose();
                    }}
                    className="text-sm font-bold text-slate-100 hover:text-emerald-300 transition-colors cursor-pointer line-clamp-2"
                  >
                    {article.title}
                  </h4>

                  {article.simplified && (
                    <p className="text-xs text-slate-300 line-clamp-1 italic">
                      "{article.simplified.oneLiner}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onOpenArticle(article);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveBookmark(article.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 bg-slate-800/40 hover:bg-slate-800 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Saved</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
