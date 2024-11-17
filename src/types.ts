export interface Investment {
  id: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  type: 'buy' | 'sell';
}

export interface Coin {
  id: string;
  symbol: string;
  currentPrice: number;
  color?: string;
  investments: Investment[];
}

export interface CoinSummary {
  totalInvested: number;
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
  totalQuantity: number;
  averagePurchasePrice: number;
}