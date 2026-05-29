import React, { useState, useEffect, useRef } from 'react';

const StockModal = ({ symbol, isOpen, onClose }) => {
  const [chartData, setChartData] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen && symbol) {
      fetchChartData();
      fetchNews();
    }
  }, [isOpen, symbol]);

  const fetchChartData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/chart/${symbol}`);
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/news/${symbol}`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{symbol} - Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {loading ? (
          <p>Loading chart and news...</p>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Technical Chart</h3>
              <div ref={chartContainerRef} className="h-64 bg-gray-100 rounded flex items-center justify-center">
                {chartData ? "Chart will render here" : "No chart data"}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Latest News & Sentiment</h3>
              {news.length === 0 ? (
                <p>No news available.</p>
              ) : (
                <ul className="space-y-2">
                  {news.map((item, idx) => (
                    <li key={idx} className="border-b pb-2">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {item.title}
                      </a>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        item.sentiment_label === 'positive' ? 'bg-green-100 text-green-800' :
                        item.sentiment_label === 'negative' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        Sentiment: {item.sentiment_label} ({item.sentiment_score})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockModal;