export type AudienceLevel = 'beginner' | 'student' | 'executive' | 'investor';
export type SimplificationMode = 'quick' | 'executive' | 'deep';

export interface JargonItem {
  term: string;
  definition: string;
  simpleAnalogy: string;
}

export interface MarketImpact {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Mixed';
  sentimentScore: number; // -100 to 100
  affectedSectors: string[];
  whoWins: string[];
  whoLoses: string[];
  retailInvestorTakeaway: string;
}

export interface SimplifiedContent {
  headline: string;
  oneLiner: string;
  summary: string;
  keyTakeaways: string[];
  jargonDecoded: JargonItem[];
  marketImpact: MarketImpact;
  eli5: string;
  quickQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  simplifiedAt: string;
  audienceLevel: AudienceLevel;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'markets' | 'economy' | 'tech' | 'crypto' | 'commodities' | 'central-banks';
  originalSnippet: string;
  fullText?: string;
  tickers?: string[];
  readTimeMinutes: number;
  isBreaking?: boolean;
  simplified?: SimplifiedContent;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}
