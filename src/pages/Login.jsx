import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className="w-full border p-2 mb-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full border p-2 mb-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
      </form>
      <p className="mt-2 text-center">Don't have an account? <a href="/register" className="text-blue-600">Sign up</a></p>
    </div>
  );
}