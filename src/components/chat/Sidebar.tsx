'use client';

import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { Conversation } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { Users, Search, PlusCircle, MessageSquare, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeConvId: string | null;
  onSelect: (id: string) => void;
}

export default function Sidebar({ activeConvId, onSelect }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
  });

  // Ensure conversations is an array (in case the API wraps it in an object or returns error)
  const convArray = Array.isArray(conversations) ? conversations : [];

  // Filter conversations locally by name or participant name
  const filteredConvs = convArray.filter((c) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    if (c.name && c.name.toLowerCase().includes(searchLower)) return true;
    
    // Check participants
    return c.participants?.some(
      (p) => p.id !== user?.id && p.name.toLowerCase().includes(searchLower)
    );
  });

  const getConvName = (conv: Conversation) => {
    if (conv.isGroup && conv.name) return conv.name;
    const otherParticipant = conv.participants.find((p) => p.id !== user?.id);
    return otherParticipant?.name || 'Unknown User';
  };

  return (
    <div className={clsx(
      "h-full bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 transition-all",
      activeConvId ? "hidden md:flex md:w-80" : "w-full md:w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          Chats
        </h2>
        <button className="text-slate-400 hover:text-white transition-colors" title="New Group">
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredConvs?.length === 0 ? (
          <div className="text-center text-slate-500 mt-10 text-sm">
            No conversations found.
          </div>
        ) : (
          filteredConvs?.map((conv) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onSelect(conv.id)}
              className={clsx(
                'w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all duration-200',
                activeConvId === conv.id
                  ? 'bg-indigo-600/20 border border-indigo-500/30'
                  : 'hover:bg-slate-800 border border-transparent'
              )}
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium',
                  conv.isGroup ? 'bg-indigo-600' : 'bg-slate-700'
                )}
              >
                {conv.isGroup ? <Users className="w-5 h-5" /> : getConvName(conv).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-200 truncate">
                  {getConvName(conv)}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {conv.isGroup ? `${conv.participants.length} members` : 'Direct message'}
                </p>
              </div>
            </motion.button>
          ))
        )}
      </div>
      {/* Footer / Profile / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-200 truncate">{user?.name}</span>
              <span className="text-xs text-slate-400 truncate">{user?.phone}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0 ml-2"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
