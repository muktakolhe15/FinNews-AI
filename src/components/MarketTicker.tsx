import React from 'react';
import { MarketIndex } from '../types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const INDICES: MarketIndex[] = [
  { symbol: 'S&P 500', name: 'S&P 500', price: '5,864.20', change: '+0.42%', isPositive: true },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite', price: '18,518.61', change: '+0.68%', isPositive: true },
  { symbol: 'DOW', name: 'Dow Jones', price: '42,454.12', change: '-0.15%', isPositive: false },
  { symbol: 'US 10Y', name: '10-Yr Treasury', price: '4.18%', change: '+2.4 bps', isPositive: false },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$68,420', change: '+2.10%', isPositive: true },
  { symbol: 'BRENT', name: 'Crude Oil', price: '$82.40/bbl', change: '+1.45%', isPositive: true },
  { symbol: 'GOLD', name: 'Gold Oz', price: '$2,735.80', change: '+0.55%', isPositive: true },
  { symbol: 'EUR/USD', name: 'Euro Dollar', price: '1.0824', change: '-0.18%', isPositive: false },
  { symbol: 'VIX', name: 'Volatility Index', price: '15.40', change: '-4.20%', isPositive: true },
];

export const MarketTicker: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border-y border-slate-800/80 backdrop-blur-sm overflow-hidden py-2 select-none">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-3 py-0.5 text-xs font-mono font-medium text-emerald-400 border-r border-slate-800 shrink-0 z-10 bg-slate-900/95 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Activity className="w-3.5 h-3.5 ml-1" />
          <span>LIVE MARKETS</span>
        </div>

        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-8 pl-4">
            {[...INDICES, ...INDICES].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs font-mono">
                <span className="font-semibold text-slate-300">{item.symbol}</span>
                <span className="text-slate-400">{item.price}</span>
                <span
                  className={`flex items-center gap-0.5 font-medium ${
                    item.isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
