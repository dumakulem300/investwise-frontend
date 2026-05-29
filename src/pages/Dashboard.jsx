import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StockModal from '../components/StockModal';

export default function Dashboard() {
  const { subscription, user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await api.get('/stocks');
      setStocks(res.data.stocks || []);
    } catch (error) {
      console.error('Failed to fetch stocks', error);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = subscription?.active === true;
  const visibleStocks = isPremium ? stocks : stocks.slice(0, 3);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading stocks...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Market Dashboard</h1>
        <div className="bg-gray-100 p-2 rounded">
          {isPremium ? (
            <span className="text-green-600">✅ Premium Active – Expires: {subscription.expiry_date?.split('T')[0]}</span>
          ) : (
            <span className="text-orange-600">⚠️ Free Tier – <a href="/subscription" className="underline">Upgrade</a> to see all 10 stocks</span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Symbol</th>
              <th className="p-2 border">Price (₱)</th>
              <th className="p-2 border">Change %</th>
              <th className="p-2 border">Signal</th>
              <th className="p-2 border">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {visibleStocks.map((stock) => (
              <tr key={stock.symbol} className="cursor-pointer hover:bg-gray-50" onClick={() => handleStockClick(stock)}>
                <td className="p-2 border font-bold">{stock.symbol}</td>
                <td className="p-2 border">{stock.price?.toFixed(2) ?? '-'}</td>
                <td className={`p-2 border ${stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change_percent ? `${stock.change_percent > 0 ? '+' : ''}${stock.change_percent}%` : '-'}
                </td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-sm ${
                    stock.signal === 'GOOD' ? 'bg-green-100 text-green-800' :
                    stock.signal === 'AVOID' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stock.signal}
                  </span>
                </td>
                <td className="p-2 border text-sm">{stock.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedStock && (
        <StockModal stock={selectedStock} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}