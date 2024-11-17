import React from 'react';
import { Coin, CoinSummary } from '../types';
import { InvestmentList } from './InvestmentList';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CoinDetailsProps {
  coin: Coin;
  onDeleteInvestment: (coinId: string, investmentId: string) => void;
}

export function CoinDetails({ coin, onDeleteInvestment }: CoinDetailsProps) {
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
    <div className="p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">${coin.currentPrice.toFixed(2)}</h2>
            <div className={`flex items-center space-x-1 ${isProfit ? 'text-green-500' : 'text-red-500'} text-sm font-semibold`}>
              {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(summary.profitPercentage).toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current {coin.symbol} Price</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Invested</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">${summary.totalInvested.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">${summary.currentValue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Quantity</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{summary.totalQuantity.toFixed(8)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Purchase Price</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">${summary.averagePurchasePrice.toFixed(2)}</p>
        </div>
      </div>

      <InvestmentList
        investments={coin.investments}
        currentPrice={coin.currentPrice}
        onDelete={(investmentId) => onDeleteInvestment(coin.id, investmentId)}
      />
    </div>
  );
}