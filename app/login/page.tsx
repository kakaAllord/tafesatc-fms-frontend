'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { login } from '../services/api';
import { Home, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ username, password });
      if (res.data.success) {
        Cookies.set('token', res.data.body.token);
        Cookies.set('familyId', res.data.body.family._id);
        router.push('/dashboard');
      } else {
        setError(res.data.error || 'Identity verification failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Connection to sector failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative p-8 bg-white rounded-[32px] shadow-2xl w-full max-w-md border border-slate-100 mx-4">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 relative bg-slate-50 rounded-2xl p-4 mb-5 shadow-sm border border-slate-100 h-20">
            <Image
              src="/logo-blue.png"
              alt="TAFES Logo"
              fill
              className="object-contain p-2"
            />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
            We<span className="text-blue-600">Fam</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold italic text-sm tracking-widest uppercase opacity-60">Family Portal Access</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 flex items-start gap-3 animate-head-shake">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-xs font-black uppercase italic tracking-wider">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Family Identifier</label>
            <div className="relative">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 text-slate-900 transition-all font-black placeholder:font-normal placeholder:opacity-30"
                placeholder="e.g. ndikumana_family"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Access Pass-Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 text-slate-900 transition-all font-black placeholder:font-normal placeholder:opacity-30"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-[0.97] flex items-center justify-center gap-3 mt-6 uppercase tracking-widest text-sm italic"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Decrypting...</span>
              </>
            ) : (
              <>
                <span>Initialize Access</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">
            © 2026 TAFES Burundi Core
          </p>
        </div>
      </div>
    </div>
  );
}
