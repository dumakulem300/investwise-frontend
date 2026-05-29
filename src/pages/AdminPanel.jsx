import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data.payments);
    } catch (err) {
      console.error(err);
      setActionMessage('Failed to load payments. Ensure you are admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId) => {
    try {
      await api.post('/admin/verify-payment', { payment_id: paymentId });
      setActionMessage(`Payment ${paymentId} verified.`);
      fetchPayments();
    } catch (err) {
      setActionMessage(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleReject = async (paymentId) => {
    try {
      await api.post('/admin/reject-payment', { payment_id: paymentId });
      setActionMessage(`Payment ${paymentId} rejected.`);
      fetchPayments();
    } catch (err) {
      setActionMessage(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading payments...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel – Pending Payments</h1>
      {actionMessage && <div className="bg-blue-100 p-2 rounded mb-4">{actionMessage}</div>}
      {payments.length === 0 ? (
        <p>No pending payments.</p>
      ) : (
        <div className="space-y-6">
          {payments.map(payment => (
            <div key={payment.payment_id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>User:</strong> {payment.user_email} (ID: {payment.user_id})</p>
                  <p><strong>Plan:</strong> {payment.plan} – ₱{payment.amount}</p>
                  <p><strong>Date:</strong> {payment.created_at}</p>
                </div>
                <div>
                  <p className="font-semibold">Screenshot:</p>
                  <img src={`data:image/png;base64,${payment.screenshot_base64}`} alt="Receipt" className="max-h-48 border rounded" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleVerify(payment.payment_id)} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
                  Verify
                </button>
                <button onClick={() => handleReject(payment.payment_id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}