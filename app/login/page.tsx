'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { login } from '../services/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.data.success) {
        Cookies.set('token', res.data.body.token);
        Cookies.set('familyId', res.data.body.family._id);
        router.push('/dashboard');
      } else {
        setError(res.data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-8 bg-blue-50 rounded-xl shadow-lg w-full max-w-sm border border-blue-100">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-900">WeFam</h1>
        {error && <p className="text-red-500 mb-4 text-center text-sm bg-red-100 p-2 rounded">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">My Family Name (Username)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900 bg-white placeholder-gray-400"
              placeholder="Enter family username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900 bg-white placeholder-gray-400"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
