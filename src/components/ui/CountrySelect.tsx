'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Country } from '@/constants/countries';
import { motion, AnimatePresence } from 'framer-motion';

interface CountrySelectProps {
  value: string; // The selected country code (e.g. '+880')
  onChange: (code: string) => void;
  countries: Country[];
}

export default function CountrySelect({ value, onChange, countries }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(c => c.code === value) || countries[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 bg-[#1f2438] text-[#8e96a8] hover:text-white text-sm py-2.5 px-3 focus:outline-none border-r border-[#232738] transition-colors h-full min-w-[80px]"
      >
        <span className="flex items-center gap-1.5 font-medium">
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="text-xs">{selectedCountry.code}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-[220px] bg-[#151927] border border-[#232738] rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div 
              className="max-h-[200px] overflow-y-auto p-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {countries.map((country) => (
                <button
                  key={`${country.name}-${country.code}`}
                  type="button"
                  onClick={() => {
                    onChange(country.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${
                    value === country.code
                      ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                      : 'text-[#8e96a8] hover:bg-[#1f2438] hover:text-white'
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-xs opacity-70">{country.code}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
