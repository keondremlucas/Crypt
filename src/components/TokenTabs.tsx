import React from 'react';
import { Coin } from '../types';
import { CoinDetails } from './CoinDetails';
import { Coins as CoinsIcon } from 'lucide-react';

interface TokenTabsProps {
  coins: Coin[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onDeleteInvestment: (coinId: string, investmentId: string) => void;
}

export function TokenTabs({ coins, activeTab, onTabChange, onDeleteInvestment }: TokenTabsProps) {
  const activeCoin = coins.find(coin => coin.id === activeTab);

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {coins.map((coin) => {
            const isActive = coin.id === activeTab;
            return (
              <button
                key={coin.id}
                onClick={() => onTabChange(coin.id)}
                className={`
                  flex items-center space-x-2 px-6 py-4 text-sm font-medium
                  ${isActive 
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <CoinsIcon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
                <span>{coin.symbol}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {activeCoin && (
        <CoinDetails
          coin={activeCoin}
          onDeleteInvestment={onDeleteInvestment}
        />
      )}
    </div>
  );
}