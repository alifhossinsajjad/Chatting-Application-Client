'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Phone, User as UserIcon } from 'lucide-react';

import { authService, LoginPayload } from '@/services/authService';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (data) => {
      if (data.token && data.user) {
        login(data.token, data.user);
        router.push('/chat');
      } else {
        setErrorMsg('Invalid response from server.');
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Something went wrong. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phone || !name) {
      setErrorMsg('Please enter both phone and name.');
      return;
    }
    loginMutation.mutate({ phone, name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
        <p className="text-gray-300 text-sm">Enter your phone and name to continue.</p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-500/50 rounded-lg text-center"
        >
          {errorMsg}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-200" htmlFor="name">
            Display Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="e.g. John Doe"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-200" htmlFor="phone">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="+1 555 123 4567"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
        >
          {loginMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Continue to Chat'
          )}
        </button>
      </form>
    </motion.div>
  );
}
