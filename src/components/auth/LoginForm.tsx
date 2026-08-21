'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import CountrySelect from '@/components/ui/CountrySelect';
import { COUNTRIES } from '@/constants/countries';

import { authService, LoginPayload } from '@/services/authService';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+]/g, ''); // allow digits and +
    
    // If they paste the country code, strip it
    if (val.startsWith(countryCode)) {
      val = val.substring(countryCode.length);
    } else if (val.startsWith(countryCode.replace('+', ''))) {
      val = val.substring(countryCode.length - 1);
    }
    
    setPhone(val);
  };

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
    const fullPhone = `${countryCode}${phone.replace(/\s+/g, '')}`;
    loginMutation.mutate({ phone: fullPhone, name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[380px] p-6 sm:p-8 bg-[#151927] border border-[#232738] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
    >
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="h-10 px-3 bg-[#1f2438] rounded-lg flex items-center justify-center border border-[#2a304a] shadow-inner gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px] font-semibold text-indigo-400 tracking-wide">Flux Chat</span>
        </div>
        
        <div className="space-y-1.5">
          <h1 className="text-[28px] font-semibold tracking-tight text-white">Flux</h1>
          <p className="text-[#8e96a8] text-sm">Conversations, without the clutter.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-[#8e96a8] uppercase" htmlFor="name">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0d101b] border border-[#232738] rounded-lg text-white placeholder:text-[#4b5563] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-[#8e96a8] uppercase" htmlFor="phone">
            Phone Number
          </label>
          <div className={`relative flex items-center bg-[#0d101b] border rounded-lg focus-within:ring-1 transition-all overflow-visible ${errorMsg ? 'border-[#f87171] focus-within:ring-[#f87171] focus-within:border-[#f87171]' : 'border-[#232738] focus-within:ring-indigo-500 focus-within:border-indigo-500'}`}>
            <CountrySelect 
              value={countryCode} 
              onChange={setCountryCode} 
              countries={COUNTRIES} 
            />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full pl-3 pr-3.5 py-2.5 bg-transparent text-white placeholder:text-[#4b5563] focus:outline-none text-sm tracking-wide"
              placeholder="Enter Your Number"
            />
            {errorMsg && (
              <div className="pr-3.5">
                <AlertCircle className="w-4 h-4 text-[#f87171]" />
              </div>
            )}
          </div>
          {errorMsg && (
            <p className="text-[11px] text-[#f87171] font-medium pt-0.5">
              {errorMsg}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3 mt-6 bg-[#7470f5] hover:bg-[#635fe3] text-white rounded-lg font-semibold text-xs tracking-wider transition-all flex items-center justify-center disabled:opacity-70"
        >
          {loginMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'CONTINUE'
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-[11px] text-[#8e96a8]">
          By continuing, you agree to our <a href="#" className="hover:text-gray-300">Terms</a> and <a href="#" className="hover:text-gray-300">Privacy Policy</a>.
        </p>
      </div>
    </motion.div>
  );
}
