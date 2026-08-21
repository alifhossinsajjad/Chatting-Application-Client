'use client';

import { User } from '@/types';
import { Loader2, Check } from 'lucide-react';
import clsx from 'clsx';

interface UserListProps {
  users?: User[];
  isLoading: boolean;
  currentUserId?: string;
  selectedUsers: User[];
  onToggleUser: (user: User) => void;
}

export default function UserList({ users, isLoading, currentUserId, selectedUsers, onToggleUser }: UserListProps) {
  const filteredUsers = users?.filter(u => u.id !== currentUserId) || [];

  return (
    <div className="border border-slate-800 rounded-lg bg-[#0d101b] overflow-hidden">
      <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-slate-500 p-4 text-xs">
            No users found.
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isSelected = selectedUsers.some(su => su.id === u.id);
            return (
              <button
                key={u.id}
                onClick={() => onToggleUser(u)}
                className={clsx(
                  "w-full flex items-center justify-between p-2 rounded-md transition-colors",
                  isSelected ? "bg-indigo-600/10" : "hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-white font-medium text-xs">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-200">{u.name}</p>
                    <p className="text-[10px] text-slate-500">{u.phone}</p>
                  </div>
                </div>
                <div className={clsx(
                  "w-5 h-5 rounded border flex items-center justify-center transition-colors mr-1",
                  isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-600 bg-transparent"
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  );
}
