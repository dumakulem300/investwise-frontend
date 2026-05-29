import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Subscription = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState('monthly');
  const [screenshot, setScreenshot] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      setMessage('Please select a screenshot');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('screenshot', screenshot);
    formData.append('plan', plan);
    try {
      const response = await api.post('/subscribe', formData);
      setMessage('Payment pending. Admin will verify within 24h.');
      setScreenshot(null);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error submitting payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Subscribe to InvestWise</h1>
      
      <div className="bg-gray-100 border-2 border-dashed border-gray-400 p-4 text-center rounded mb-6">
        <p className="text-gray-600">📱 GCash QR Code will appear here</p>
        <p className="text-sm text-gray-500 mt-2">Please upload your payment screenshot below.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div onClick={() => setPlan('monthly')} className={`border rounded-lg p-4 cursor-pointer ${plan === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
          <h2 className="text-xl font-bold">Monthly</h2>
          <p className="text-2xl font-bold text-blue-600">₱299</p>
          <p className="text-sm text-gray-500">billed monthly</p>
        </div>
        <div onClick={() => setPlan('yearly')} className={`border rounded-lg p-4 cursor-pointer ${plan === 'yearly' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
          <h2 className="text-xl font-bold">Yearly</h2>
          <p className="text-2xl font-bold text-blue-600">₱2,999</p>
          <p className="text-sm text-gray-500">save 16%</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">GCash Payment Screenshot</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" required />
          <p className="text-xs text-gray-500 mt-1">After paying to GCash number (show in QR), upload the receipt.</p>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </form>

      {message && <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">{message}</div>}
    </div>
  );
};

export default Subscription;