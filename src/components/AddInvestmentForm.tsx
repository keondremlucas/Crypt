import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddInvestmentFormProps {
  onAdd: (investment: {
    symbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
    currentPrice: number;
  }) => void;
}

export function AddInvestmentForm({ onAdd }: AddInvestmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: '',
    currentPrice: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.purchasePrice || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Valid purchase price is required';
    }
    if (!formData.currentPrice || Number(formData.currentPrice) <= 0) {
      newErrors.currentPrice = 'Valid current price is required';
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onAdd({
      symbol: formData.symbol.toUpperCase(),
      quantity: Number(formData.quantity),
      purchasePrice: Number(formData.purchasePrice),
      purchaseDate: formData.purchaseDate,
      currentPrice: Number(formData.currentPrice)
    });

    setFormData({
      symbol: '',
      quantity: '',
      purchasePrice: '',
      purchaseDate: '',
      currentPrice: ''
    });
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-10">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Investment</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Coin Symbol</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.symbol ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="BTC"
              />
              {errors.symbol && <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                step="any"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.quantity ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Price ($)</label>
              <input
                type="number"
                name="purchasePrice"
                step="any"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.purchasePrice ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {errors.purchasePrice && <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Current Price ($)</label>
              <input
                type="number"
                name="currentPrice"
                step="any"
                value={formData.currentPrice}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.currentPrice ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {errors.currentPrice && <p className="mt-1 text-sm text-red-600">{errors.currentPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${errors.purchaseDate ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.purchaseDate && <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Add Investment
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}