import React from 'react';
import { Investment } from '../types';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface InvestmentListProps {
  investments: Investment[];
  currentPrice: number;
  onDelete: (id: string) => void;
}

export function InvestmentList({ investments, currentPrice, onDelete }: InvestmentListProps) {
  const sortedInvestments = [...investments].sort((a, b) => 
    new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Date</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Type</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Quantity</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Price</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Total</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">Current P/L</th>
              <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            {sortedInvestments.map((investment) => {
              const isBuy = investment.type === 'buy';
              const quantity = Math.abs(investment.quantity);
              const total = quantity * investment.purchasePrice;
              const currentTotal = quantity * currentPrice;
              const profit = isBuy ? currentTotal - total : total - currentTotal;
              const profitPercentage = (profit / total) * 100;
              
              return (
                <tr key={investment.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-4 text-gray-900 dark:text-gray-100">
                    {new Date(investment.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
                      {isBuy ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {isBuy ? 'Buy' : 'Sell'}
                    </span>
                  </td>
                  <td className="py-4 text-gray-900 dark:text-gray-100">{quantity.toFixed(8)}</td>
                  <td className="py-4 text-gray-900 dark:text-gray-100">${investment.purchasePrice.toFixed(2)}</td>
                  <td className="py-4 text-gray-900 dark:text-gray-100">${total.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`flex items-center ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {profit >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      ${Math.abs(profit).toFixed(2)} ({Math.abs(profitPercentage).toFixed(2)}%)
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => onDelete(investment.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}