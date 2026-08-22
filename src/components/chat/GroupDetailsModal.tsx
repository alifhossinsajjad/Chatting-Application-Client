"use client";

import { useState, useEffect } from "react";
import { User, Conversation } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { Users, UserPlus, MoreVertical, ShieldAlert, UserMinus, ArrowLeft, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import SelectedUserChips from "./SelectedUserChips";
import UserList from "./UserList";

import { useSearchUsers } from "@/hooks/useUsers";
import {
  useAddParticipants,
  useRemoveParticipant,
  usePromoteToAdmin,
} from "@/hooks/useConversations";

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export default function GroupDetailsModal({
  isOpen,
  onClose,
  conversation,
}: GroupDetailsModalProps) {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const { data: searchResults, isLoading: isSearchLoading } = useSearchUsers(
    debouncedSearch,
    isAdding
  );

  const addParticipantsMutation = useAddParticipants(conversation.id);
  const removeParticipantMutation = useRemoveParticipant(conversation.id);
  const promoteToAdminMutation = usePromoteToAdmin(conversation.id);

  // Derived state
  const isAdmin = conversation.admins?.includes(currentUserId || "");
  const participantIds = conversation.participants.map((p) => p.id || (p as any)._id);
  
  // Filter out users that are already in the group for the search results
  const availableUsersToAdd = searchResults?.filter(
    (u) => !participantIds.includes(u.id || (u as any)._id)
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setIsAdding(false);
      setSearchTerm("");
      setSelectedUsers([]);
      setOpenDropdownId(null);
    }
  }, [isOpen]);

  const handleToggleAddUser = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleAddMembers = () => {
    if (selectedUsers.length === 0) return;
    const userIds = selectedUsers.map((u) => u.id || (u as any)._id);
    addParticipantsMutation.mutate(userIds, {
      onSuccess: () => {
        setIsAdding(false);
        setSearchTerm("");
        setSelectedUsers([]);
      },
    });
  };

  const handleRemove = (userId: string) => {
    removeParticipantMutation.mutate(userId, {
      onSuccess: () => setOpenDropdownId(null),
    });
  };

  const handlePromote = (userId: string) => {
    promoteToAdminMutation.mutate(userId, {
      onSuccess: () => setOpenDropdownId(null),
    });
  };

  const renderAddMemberView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50">
        <button
          onClick={() => setIsAdding(false)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-white">Add Members</h3>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-[#8e96a8] uppercase">
            Search Users
          </label>
          <SelectedUserChips users={selectedUsers} onRemove={handleToggleAddUser} />
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search to add..."
          />
        </div>

        <UserList
          users={availableUsersToAdd}
          isLoading={isSearchLoading}
          currentUserId={currentUserId}
          selectedUsers={selectedUsers}
          onToggleUser={handleToggleAddUser}
        />
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleAddMembers}
          disabled={selectedUsers.length === 0 || addParticipantsMutation.isPending}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          {addParticipantsMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Add to Group"
          )}
        </button>
      </div>
    </div>
  );

  const renderMemberListView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{conversation.name}</h3>
            <p className="text-xs text-slate-400">{conversation.participants.length} Members</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {isAdmin && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800/50 rounded-lg transition-colors mb-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="font-medium text-indigo-400 group-hover:text-indigo-300">Add people</span>
          </button>
        )}

        <div className="space-y-1 mt-2">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Group Members
          </div>
          {conversation.participants.map((p) => {
            const uid = p.id || (p as any)._id;
            const isMemberAdmin = conversation.admins?.includes(uid);
            const isMe = uid === currentUserId;
            const isDropdownOpen = openDropdownId === uid;

            return (
              <div key={uid} className="relative flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {p.name} {isMe && <span className="text-slate-500 text-xs font-normal">(You)</span>}
                    </p>
                    {isMemberAdmin && (
                      <p className="text-[10px] text-indigo-400 font-medium">Admin</p>
                    )}
                  </div>
                </div>

                {isAdmin && !isMe && (
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdownId(isDropdownOpen ? null : uid)}
                      className="p-2 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full hover:bg-slate-700"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setOpenDropdownId(null)} 
                        />
                        <div className="absolute right-0 top-10 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                          {!isMemberAdmin && (
                            <button
                              onClick={() => handlePromote(uid)}
                              disabled={promoteToAdminMutation.isPending}
                              className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              Promote to Admin
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(uid)}
                            disabled={removeParticipantMutation.isPending}
                            className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-slate-700 flex items-center gap-2"
                          >
                            <UserMinus className="w-4 h-4" />
                            Remove from Group
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon={null} // We render custom header inside the content wrapper
      hideHeader={true}
    >
      <div className="h-[500px] max-h-[80vh] flex flex-col">
        {isAdding ? renderAddMemberView() : renderMemberListView()}
      </div>
    </Modal>
  );
}
