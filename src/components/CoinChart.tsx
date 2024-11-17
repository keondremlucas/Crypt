import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Coin } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CoinChartProps {
  coin: Coin;
}

export function CoinChart({ coin }: CoinChartProps) {
  const sortedInvestments = [...coin.investments].sort((a, b) => 
    new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
  );

  const data = {
    labels: sortedInvestments.map(inv => new Date(inv.purchaseDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Purchase Price',
        data: sortedInvestments.map(inv => inv.purchasePrice),
        borderColor: 'rgb(75, 85, 99)',
        backgroundColor: 'rgba(75, 85, 99, 0.5)',
      },
      {
        label: 'Current Price',
        data: sortedInvestments.map(() => coin.currentPrice),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line options={options} data={data} />;
}