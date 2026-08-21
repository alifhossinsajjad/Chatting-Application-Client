"use client";

import { useState, FormEvent, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { useAuth } from "@/providers/AuthProvider";
import { useSmartScroll } from "@/hooks/useSmartScroll";
import { Send, ArrowDown, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Message } from "@/types";

interface ChatAreaProps {
  conversationId: string;
  onBack?: () => void;
}

export default function ChatArea({ conversationId, onBack }: ChatAreaProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => chatService.getMessages(conversationId, 50),
    // For a real app we'd use useInfiniteQuery, but for this demo standard query with 50 limit is enough to show scroll
  });

  const messages = Array.isArray(data) ? data : [];

  const { scrollRef, isAtBottom, hasUnread, scrollToBottom, handleScroll } =
    useSmartScroll([messages]);

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => chatService.sendMessage(conversationId, text),
    onMutate: async (newText) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });
      const previousMessages = queryClient.getQueryData([
        "messages",
        conversationId,
      ]);

      const optimisticMsg: Message = {
        id: Math.random().toString(),
        conversationId,
        senderId: user?.id || "",
        text: newText,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ["messages", conversationId],
        (old: Message[] = []) => {
          // Assuming the API returns newest last (standard) or newest first. We'll append for standard chat
          return [...old, optimisticMsg];
        },
      );

      return { previousMessages };
    },
    onError: (err, newText, context) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        context?.previousMessages,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      scrollToBottom(true);
    },
  });

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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full w-full">
      {/* Mobile Header (Back button) */}
      <div className="md:hidden flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-900/50">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <span className="font-semibold text-slate-200">Chat</span>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-slate-500">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((msg: Message, i: number) => {
            const isMe = msg.senderId === user?.id;
            const showAvatar =
              i === 0 || messages[i - 1]?.senderId !== msg.senderId;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx("flex", isMe ? "justify-end" : "justify-start")}
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
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-medium">
                          {/* Should ideally fetch sender's name */}U
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={clsx(
                      "px-4 py-2.5 rounded-2xl break-words shadow-sm",
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm",
                    )}
                  >
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                    <div
                      className={clsx(
                        "text-[10px] mt-1 text-right",
                        isMe ? "text-indigo-200" : "text-slate-500",
                      )}
                    >
                      {formatTime(msg.createdAt)}
                    </div>
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
