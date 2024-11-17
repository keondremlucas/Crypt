import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { Coin, Investment } from '../types';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

interface PortfolioOverviewProps {
  coins: Coin[];
}

export function PortfolioOverview({ coins }: PortfolioOverviewProps) {
  const { theme } = useTheme();
  const chartRef = useRef<ChartJS>(null);

  const calculatePortfolioStats = () => {
    const totalValue = coins.reduce((total, coin) => {
      const coinValue = coin.investments.reduce((sum, inv) => sum + (inv.quantity * coin.currentPrice), 0);
      return total + coinValue;
    }, 0);

    const dailyChanges = coins.map(coin => {
      const value = coin.investments.reduce((sum, inv) => sum + (inv.quantity * coin.currentPrice), 0);
      const prevValue = coin.investments.reduce((sum, inv) => sum + (inv.quantity * (coin.currentPrice * 0.98)), 0);
      return {
        symbol: coin.symbol,
        change: ((value - prevValue) / prevValue) * 100,
        value
      };
    });

    dailyChanges.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    
    return {
      totalValue,
      topPerformer: dailyChanges[0],
      worstPerformer: dailyChanges[dailyChanges.length - 1]
    };
  };

  const calculateTransactionDetails = (coin: Coin, date: Date): string[] => {
    const transaction = coin.investments.find(inv => 
      new Date(inv.purchaseDate).getTime() === date.getTime()
    );

    if (!transaction) return [];

    const isBuy = transaction.type === 'buy';
    const quantity = Math.abs(transaction.quantity);
    const total = quantity * transaction.purchasePrice;

    if (isBuy) {
      return [
        `${coin.symbol} Buy`,
        `Amount: ${quantity.toFixed(8)} ${coin.symbol}`,
        `Price: $${transaction.purchasePrice.toFixed(2)}`,
        `Total Spent: $${total.toFixed(2)}`
      ];
    } else {
      // For sells, calculate profit/loss from previous buys
      const prevBuys = coin.investments.filter(inv => 
        inv.type === 'buy' && new Date(inv.purchaseDate) < new Date(transaction.purchaseDate)
      );
      
      const avgBuyPrice = prevBuys.reduce((sum, buy) => sum + (buy.purchasePrice * Math.abs(buy.quantity)), 0) / 
                         prevBuys.reduce((sum, buy) => sum + Math.abs(buy.quantity), 0);
      
      const saleTotal = quantity * transaction.purchasePrice;
      const costBasis = quantity * avgBuyPrice;
      const profit = saleTotal - costBasis;
      const profitPercentage = (profit / costBasis) * 100;

      return [
        `${coin.symbol} Sell`,
        `Amount: ${quantity.toFixed(8)} ${coin.symbol}`,
        `Sale Price: $${transaction.purchasePrice.toFixed(2)}`,
        `Total Received: $${saleTotal.toFixed(2)}`,
        `Profit/Loss: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(2)}%)`
      ];
    }
  };

  const stats = calculatePortfolioStats();

  const allDates = Array.from(new Set(
    coins.flatMap(coin => 
      coin.investments.map(inv => inv.purchaseDate)
    )
  )).sort();

  const data = {
    labels: allDates.map(date => new Date(date).toLocaleDateString()),
    datasets: coins.map(coin => ({
      label: coin.symbol,
      data: allDates.map(date => {
        const relevantInvestments = coin.investments.filter(inv => inv.purchaseDate <= date);
        return relevantInvestments.reduce((sum, inv) => sum + (inv.quantity * coin.currentPrice), 0);
      }),
      borderColor: coin.color,
      backgroundColor: coin.color + '40',
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'point' as const,
      intersect: true
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#111827',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (tooltipItems: any[]) => {
            return new Date(allDates[tooltipItems[0].dataIndex]).toLocaleDateString();
          },
          label: (context: any) => {
            const value = context.raw;
            const dataset = context.dataset;
            const coin = coins.find(c => c.symbol === dataset.label);
            if (!coin) return '';
            
            const date = new Date(allDates[context.dataIndex]);
            
            // Check if there's a transaction on this date
            const transactionDetails = calculateTransactionDetails(coin, date);
            if (transactionDetails.length > 0) {
              return [
                ...transactionDetails,
                '',
                `Portfolio Value: $${value.toFixed(2)}`
              ];
            }
            
            // If no transaction, show regular portfolio value
            return [
              `${dataset.label}`,
              `Portfolio Value: $${value.toFixed(2)}`
            ];
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'ctrl'
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
          onZoomComplete: ({ chart }: { chart: ChartJS }) => {
            try {
              if (!chart || !chart.scales || !chart.scales.y) return;

              const yScale = chart.scales.y;
              const visiblePoints: number[] = [];

              chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                if (!meta.visible) return;

                meta.data.forEach((point: any) => {
                  if (!point || !point.active || typeof point.parsed?.y !== 'number') return;
                  visiblePoints.push(point.parsed.y);
                });
              });

              if (visiblePoints.length === 0) return;

              const min = Math.min(...visiblePoints);
              const max = Math.max(...visiblePoints);
              const padding = (max - min) * 0.1;

              yScale.min = Math.max(0, min - padding);
              yScale.max = max + padding;

              chart.update('none');
            } catch (error) {
              console.error('Error during zoom:', error);
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(107, 114, 128, 0.3)' : 'rgba(107, 114, 128, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          callback: (value: number) => `$${value.toFixed(2)}`
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(107, 114, 128, 0.3)' : 'rgba(107, 114, 128, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${stats.totalValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Performer</p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.topPerformer.symbol}
            </span>
            <span className="text-green-500 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {stats.topPerformer.change.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Worst Performer</p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.worstPerformer.symbol}
            </span>
            <span className="text-red-500 flex items-center">
              <TrendingDown className="w-4 h-4 mr-1" />
              {stats.worstPerformer.change.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="h-96">
        <Line ref={chartRef} options={options} data={data} />
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Hold Ctrl + Mouse wheel to zoom, drag to pan
      </div>
    </div>
  );
}