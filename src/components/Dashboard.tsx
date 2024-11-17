import React, { useState } from 'react';
import { PortfolioOverview } from './PortfolioOverview';
import { TokenTabs } from './TokenTabs';
import { Coin } from '../types';

interface DashboardProps {
  coins: Coin[];
  onDeleteInvestment: (coinId: string, investmentId: string) => void;
}

export function Dashboard({ coins, onDeleteInvestment }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(coins[0]?.id || '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {coins.length > 0 && (
        <>
          <PortfolioOverview coins={coins} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <TokenTabs
              coins={coins}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onDeleteInvestment={onDeleteInvestment}
            />
          </div>
        </>
      )}
      {coins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No investments yet. Add your first investment using the button below!</p>
        </div>
      )}
    </div>
  );
}