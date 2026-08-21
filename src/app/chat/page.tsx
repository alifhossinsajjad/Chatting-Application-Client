"use client";

import { useState } from "react";
import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import { MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatDashboard() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      <Sidebar activeConvId={activeConvId} onSelect={setActiveConvId} />

      {activeConvId ? (
        <ChatArea
          conversationId={activeConvId}
          key={activeConvId}
          onBack={() => setActiveConvId(null)}
        />
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-500">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-xl">
              <MessageSquarePlus className="w-10 h-10 text-indigo-500/50" />
            </div>
            <h2 className="text-xl font-medium text-slate-300">
              Your Messages
            </h2>
            <p className="text-sm max-w-sm text-center">
              Select a conversation from the sidebar or start a new one to begin
              chatting.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
