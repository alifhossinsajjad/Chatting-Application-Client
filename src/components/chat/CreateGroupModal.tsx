"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { Users, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import SelectedUserChips from "./SelectedUserChips";
import UserList from "./UserList";

import { useSearchUsers } from "@/hooks/useUsers";
import { useCreateGroup } from "@/hooks/useConversations";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (conversationId: string) => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateGroupModalProps) {
  const { user: currentUser } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: users, isLoading } = useSearchUsers(debouncedSearch, isOpen);
  const createGroupMutation = useCreateGroup();

  const toggleUser = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user],
    );
  };

  const handleCreate = () => {
    if (!groupName.trim() || selectedUsers.length < 2) return;
    createGroupMutation.mutate(
      { name: groupName, participantIds: selectedUsers.map((u) => u.id) },
      {
        onSuccess: (newConv) => {
          setGroupName("");
          setSearchTerm("");
          setSelectedUsers([]);
          onSuccess(newConv.id);
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Group"
      icon={<Users className="w-5 h-5" />}
    >
      <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
        <div className="space-y-4">
          {/* Group Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-[#8e96a8] uppercase">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Project Team"
              className="w-full bg-[#0d101b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Participant Search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-[#8e96a8] uppercase flex justify-between">
              <span>Add Participants ({selectedUsers.length})</span>
              {selectedUsers.length < 2 && (
                <span className="text-rose-500 font-medium normal-case">
                  Select at least 2
                </span>
              )}
            </label>

            <SelectedUserChips users={selectedUsers} onRemove={toggleUser} />
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search users to add..."
            />
          </div>

          {/* User List */}
          <UserList
            users={users}
            isLoading={isLoading}
            currentUserId={currentUser?.id}
            selectedUsers={selectedUsers}
            onToggleUser={toggleUser}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleCreate}
          disabled={
            !groupName.trim() ||
            selectedUsers.length < 2 ||
            createGroupMutation.isPending
          }
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          {createGroupMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Create Group"
          )}
        </button>
      </div>
    </Modal>
  );
}
