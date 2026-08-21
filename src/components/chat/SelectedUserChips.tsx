'use client';

import { User } from '@/types';
import { X } from 'lucide-react';

interface SelectedUserChipsProps {
  users: User[];
  onRemove: (user: User) => void;
}

export default function SelectedUserChips({ users, onRemove }: SelectedUserChipsProps) {
  if (users.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {users.map(u => (
        <div key={u.id} className="flex items-center gap-1 bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded-md text-xs border border-indigo-500/30">
          {u.name}
          <button onClick={() => onRemove(u)} className="hover:text-white ml-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
