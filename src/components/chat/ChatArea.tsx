"use client";

import { useState, FormEvent, Fragment } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useConversations } from "@/hooks/useConversations";
import { useSmartScroll } from "@/hooks/useSmartScroll";
import { Send, ArrowDown, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Message } from "@/types";
import GroupDetailsModal from "./GroupDetailsModal";

interface ChatAreaProps {
  conversationId: string;
  onBack?: () => void;
}

export default function ChatArea({ conversationId, onBack }: ChatAreaProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);

  const { data = [], isLoading } = useMessages(conversationId);
  const messages = Array.isArray(data) ? data : [];

  const { scrollRef, isAtBottom, hasUnread, scrollToBottom, handleScroll } =
    useSmartScroll([messages]);

  const sendMessageMutation = useSendMessage(conversationId, () => scrollToBottom(true));

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    sendMessageMutation.mutate(trimmed);
    setInputText("");
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const { data: cachedConversations } = useConversations();
  const conversations = Array.isArray(cachedConversations) ? cachedConversations : [];
  const conversation = conversations.find(c => c.id === conversationId);

  const isGroupConv = conversation?.isGroup || conversation?.type === 'group' || !!conversation?.admins;

  const getConvName = () => {
    if (!conversation) return 'Chat';
    if (isGroupConv && conversation.name) return conversation.name;
    if ((conversation as any).participant) return (conversation as any).participant.name;
    const otherParticipant = conversation.participants?.find((p: any) => p.id !== user?.id && p._id !== user?._id);
    return otherParticipant?.name || 'Unknown User';
  };

  const getConvAvatar = () => {
    if (isGroupConv) return 'G';
    return getConvName().charAt(0).toUpperCase();
  };

  const getSenderInitial = (senderId: string) => {
    if ((conversation as any)?.participant && ((conversation as any).participant.id === senderId || (conversation as any).participant._id === senderId)) {
      return (conversation as any).participant.name?.charAt(0).toUpperCase() || 'U';
    }
    const p = conversation?.participants?.find((p:any) => p.id === senderId || p._id === senderId);
    return p?.name?.charAt(0).toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full w-full">
      {/* Header */}
      <div 
        className={clsx(
          "flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50 z-10 transition-colors",
          isGroupConv ? "cursor-pointer hover:bg-slate-800" : ""
        )}
        onClick={() => {
          if (isGroupConv) {
            setIsGroupDetailsOpen(true);
          }
        }}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onBack) onBack();
          }}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0">
          {getConvAvatar()}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-slate-200 truncate">{getConvName()}</span>
          {isGroupConv && (
            <span className="text-xs text-slate-400 truncate">{conversation?.participants?.length || 0} members</span>
          )}
        </div>
      </div>

      {isGroupConv && (
        <GroupDetailsModal
          isOpen={isGroupDetailsOpen}
          onClose={() => setIsGroupDetailsOpen(false)}
          conversation={conversation}
        />
      )}

      {/* Message List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-slate-500">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((msg: Message, i: number) => {
            // user might not have id if cached before interceptor, fallback to _id
            const currentUserId = user?.id || (user as any)?._id;
            const isMe = msg.senderId === currentUserId;
            
            const isFirstInGroup = i === 0 || messages[i - 1]?.senderId !== msg.senderId;
            const isLastInGroup = i === messages.length - 1 || messages[i + 1]?.senderId !== msg.senderId;
            const showAvatar = isLastInGroup;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  "flex",
                  isMe ? "justify-end" : "justify-start",
                  i !== 0 ? (isFirstInGroup ? "mt-4" : "mt-[2px]") : ""
                )}
              >
                <div
                  className={clsx(
                    "flex gap-2 max-w-[70%]",
                    isMe ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  {/* Avatar placeholder if not me */}
                  {!isMe && (
                    <div className="w-8 flex-shrink-0 flex items-end pb-1">
                      {showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-medium shadow-sm">
                          {getSenderInitial(msg.senderId)}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={clsx(
                      "px-3.5 py-2 break-words shadow-sm",
                      isMe ? "bg-[#0066FF] text-white" : "bg-slate-800 text-slate-200 border border-slate-700/50",
                      "rounded-2xl",
                      isMe && !isFirstInGroup && "rounded-tr-[4px]",
                      isMe && !isLastInGroup && "rounded-br-[4px]",
                      !isMe && !isFirstInGroup && "rounded-tl-[4px]",
                      !isMe && !isLastInGroup && "rounded-bl-[4px]"
                    )}
                  >
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                    {isLastInGroup && (
                      <div
                        className={clsx(
                          "text-[10px] mt-0.5 text-right",
                          isMe ? "text-blue-200/80" : "text-slate-500",
                        )}
                      >
                        {formatTime(msg.createdAt)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Smart Scroll Indicator */}
      <AnimatePresence>
        {hasUnread && !isAtBottom && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-24 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-colors z-10 flex items-center gap-2"
          >
            <ArrowDown className="w-4 h-4" />
            <span className="text-sm font-medium">New Messages</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700 focus-within:border-indigo-500/50 transition-colors"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none px-3"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sendMessageMutation.isPending}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
