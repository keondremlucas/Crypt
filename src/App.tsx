import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AddInvestmentForm } from './components/AddInvestmentForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Coin } from './types';
import { Coins } from 'lucide-react';

const DEFAULT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#F97316', // orange-500
];

function App() {
  const [coins, setCoins] = useState<Coin[]>([
    {
      id: '1',
      symbol: 'BTC',
      currentPrice: 52000,
      color: DEFAULT_COLORS[0],
      investments: [
        {
          id: 'btc1',
          quantity: 0.5,
          purchasePrice: 48000,
          purchaseDate: '2024-01-15',
          type: 'buy'
        },
        {
          id: 'btc2',
          quantity: 0.3,
          purchasePrice: 51000,
          purchaseDate: '2024-02-01',
          type: 'buy'
        },
        {
          id: 'btc3',
          quantity: -0.2,
          purchasePrice: 52500,
          purchaseDate: '2024-02-15',
          type: 'sell'
        },
        {
          id: 'btc4',
          quantity: 0.25,
          purchasePrice: 50000,
          purchaseDate: '2024-03-01',
          type: 'buy'
        }
      ],
    },
    {
      id: '2',
      symbol: 'ETH',
      currentPrice: 3200,
      color: DEFAULT_COLORS[1],
      investments: [
        {
          id: 'eth1',
          quantity: 2.5,
          purchasePrice: 2800,
          purchaseDate: '2024-01-10',
          type: 'buy'
        },
        {
          id: 'eth2',
          quantity: 1.8,
          purchasePrice: 3000,
          purchaseDate: '2024-02-05',
          type: 'buy'
        },
        {
          id: 'eth3',
          quantity: -1.5,
          purchasePrice: 3300,
          purchaseDate: '2024-02-20',
          type: 'sell'
        },
        {
          id: 'eth4',
          quantity: 1.2,
          purchasePrice: 3100,
          purchaseDate: '2024-03-05',
          type: 'buy'
        }
      ],
    },
    {
      id: '3',
      symbol: 'SOL',
      currentPrice: 110,
      color: DEFAULT_COLORS[2],
      investments: [
        {
          id: 'sol1',
          quantity: 15,
          purchasePrice: 85,
          purchaseDate: '2024-01-05',
          type: 'buy'
        },
        {
          id: 'sol2',
          quantity: -5,
          purchasePrice: 95,
          purchaseDate: '2024-01-20',
          type: 'sell'
        },
        {
          id: 'sol3',
          quantity: 10,
          purchasePrice: 100,
          purchaseDate: '2024-02-10',
          type: 'buy'
        },
        {
          id: 'sol4',
          quantity: -8,
          purchasePrice: 115,
          purchaseDate: '2024-03-01',
          type: 'sell'
        }
      ],
    },
    {
      id: '4',
      symbol: 'MATIC',
      currentPrice: 1.20,
      color: DEFAULT_COLORS[3],
      investments: [
        {
          id: 'matic1',
          quantity: 1000,
          purchasePrice: 0.90,
          purchaseDate: '2024-01-01',
          type: 'buy'
        },
        {
          id: 'matic2',
          quantity: 500,
          purchasePrice: 1.05,
          purchaseDate: '2024-02-01',
          type: 'buy'
        },
        {
          id: 'matic3',
          quantity: -750,
          purchasePrice: 1.25,
          purchaseDate: '2024-02-25',
          type: 'sell'
        }
      ],
    }
  ]);

  const handleAddInvestment = (newInvestment: {
    symbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
    currentPrice: number;
  }) => {
    const existingCoin = coins.find(
      (coin) => coin.symbol.toLowerCase() === newInvestment.symbol.toLowerCase()
    );

    if (existingCoin) {
      setCoins(
        coins.map((coin) =>
          coin.id === existingCoin.id
            ? {
                ...coin,
                investments: [
                  ...coin.investments,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    quantity: newInvestment.quantity,
                    purchasePrice: newInvestment.purchasePrice,
                    purchaseDate: newInvestment.purchaseDate,
                    type: newInvestment.quantity > 0 ? 'buy' : 'sell'
                  },
                ],
                currentPrice: newInvestment.currentPrice,
              }
            : coin
        )
      );
    } else {
      const newCoin: Coin = {
        id: Math.random().toString(36).substr(2, 9),
        symbol: newInvestment.symbol,
        currentPrice: newInvestment.currentPrice,
        color: DEFAULT_COLORS[coins.length % DEFAULT_COLORS.length],
        investments: [
          {
            id: Math.random().toString(36).substr(2, 9),
            quantity: newInvestment.quantity,
            purchasePrice: newInvestment.purchasePrice,
            purchaseDate: newInvestment.purchaseDate,
            type: newInvestment.quantity > 0 ? 'buy' : 'sell'
          },
        ],
      };
      setCoins([...coins, newCoin]);
    }
  };

  const handleDeleteInvestment = (coinId: string, investmentId: string) => {
    setCoins(
      coins.map((coin) => {
        if (coin.id === coinId) {
          const updatedInvestments = coin.investments.filter(
            (inv) => inv.id !== investmentId
          );
          return updatedInvestments.length === 0
            ? null
            : { ...coin, investments: updatedInvestments };
        }
        return coin;
      }).filter((coin): coin is Coin => coin !== null)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Coins className="w-8 h-8 text-blue-600 dark:text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">CryptoTracker</span>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <Dashboard coins={coins} onDeleteInvestment={handleDeleteInvestment} />
        <AddInvestmentForm onAdd={handleAddInvestment} />
      </main>
    </div>
  );
}

export default App;