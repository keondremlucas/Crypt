import React from 'react';
import { Coin, CoinSummary } from '../types';
import { InvestmentList } from './InvestmentList';
import { TrendingUp, TrendingDown, Coins as CoinsIcon } from 'lucide-react';

interface CoinCardProps {
  coin: Coin;
  onDeleteInvestment: (coinId: string, investmentId: string) => void;
}

export function CoinCard({ coin, onDeleteInvestment }: CoinCardProps) {
  const calculateSummary = (coin: Coin): CoinSummary => {
    const summary = coin.investments.reduce(
      (acc, inv) => {
        const investmentValue = inv.quantity * inv.purchasePrice;
        acc.totalInvested += investmentValue;
        acc.totalQuantity += inv.quantity;
        return acc;
      },
      { totalInvested: 0, currentValue: 0, totalProfit: 0, profitPercentage: 0, totalQuantity: 0, averagePurchasePrice: 0 }
    );

    summary.currentValue = summary.totalQuantity * coin.currentPrice;
    summary.totalProfit = summary.currentValue - summary.totalInvested;
    summary.profitPercentage = (summary.totalProfit / summary.totalInvested) * 100;
    summary.averagePurchasePrice = summary.totalInvested / summary.totalQuantity;

    return summary;
  };

  const summary = calculateSummary(coin);
  const isProfit = summary.totalProfit >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CoinsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{coin.symbol}</h2>
              <p className="text-sm text-gray-500">Current Price: ${coin.currentPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${isProfit ? 'text-green-600' : 'text-red-600'} font-semibold`}>
            {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span>{Math.abs(summary.profitPercentage).toFixed(2)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Invested</p>
            <p className="text-lg font-semibold">${summary.totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-lg font-semibold">${summary.currentValue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Quantity</p>
            <p className="text-lg font-semibold">{summary.totalQuantity.toFixed(8)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Avg. Purchase Price</p>
            <p className="text-lg font-semibold">${summary.averagePurchasePrice.toFixed(2)}</p>
          </div>
        </div>

        <InvestmentList
          investments={coin.investments}
          currentPrice={coin.currentPrice}
          onDelete={(investmentId) => onDeleteInvestment(coin.id, investmentId)}
        />
      </div>
    </div>
  );
}