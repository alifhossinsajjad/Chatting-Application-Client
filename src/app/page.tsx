"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  MessageSquare,
  RefreshCcw,
  Search,
  Users,
  Lock,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuth } from '@/providers/AuthProvider';

export default function LandingPage() {
  const { user } = useAuth();
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Flux</span>
        </div>

        {/* <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </div> */}

        <div className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <Link
              href="/chat"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
              Go to Chat
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
              >
                Start Messaging
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-6 text-center relative z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Conversations, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              without the clutter.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Fast, reliable messaging for teams. Built for deep focus and
            seamless collaboration. Experience a communication platform that
            gets out of your way.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link
                href="/chat"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2"
              >
                Go to Chat
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2"
              >
                Start Messaging Free
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white border border-gray-700 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              View Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="max-w-6xl mx-auto mt-20 px-6 relative z-10"
        >
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop"
              alt="Flux Dashboard"
              className="w-full rounded-xl opacity-80 mix-blend-screen"
            />
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Engineered for focus.
            </h2>
            <p className="text-gray-400">
              Everything you need to communicate effectively, organized in a
              system that respects your time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-900/50 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Real-time sync across devices
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your conversations flow seamlessly from desktop to mobile. Never
                lose context, no matter where you are working from.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 transition-all"
            >
              <div className="w-12 h-12 bg-cyan-900/50 text-cyan-400 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-gray-400 leading-relaxed">
                Find any message, file, or link instantly with advanced
                filtering and context-aware results.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 transition-all"
            >
              <div className="w-12 h-12 bg-orange-900/50 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Group Collaboration
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Organize teams into dedicated channels with granular permissions
                and structured threading.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 transition-all relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-rose-900/50 text-rose-400 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Enterprise-grade Security
              </h3>
              <p className="text-gray-400 leading-relaxed">
                End-to-end encryption and compliance standards built into the
                core foundation of the platform.
              </p>
              <Lock className="absolute -bottom-4 -right-4 w-32 h-32 text-gray-800/30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-gray-800/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to clear the clutter?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join thousands of teams who have transformed their communication
            workflow.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
          >
            Start Messaging Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 text-center text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-gray-400" />
          </div>
          <span className="font-semibold text-gray-300">Flux</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            GitHub
          </a>
        </div>
        <p className="mt-4 md:mt-0">
          &copy; 2026 Flux Messaging. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
