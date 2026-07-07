"use client";

import { motion } from "framer-motion";
import { Mic2, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 pt-20">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-rose-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-indigo-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          Built for Smart Bharat Hackathon
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance text-5xl font-extrabold tracking-tight text-white sm:text-7xl"
        >
          The voice-first civic AI companion for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">every Indian</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300"
        >
          Sahayak helps citizens apply for schemes and file complaints using only their voice — while giving officials an AI co-pilot that drafts responses, prioritizes urgent cases, and preserves institutional knowledge.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/citizen"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-900/30 transition-transform hover:scale-105"
          >
            <Mic2 className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            Try VoiceGov Demo
          </Link>
          <Link
            href="/official"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            <ShieldCheck className="h-5 w-5" />
            Panchayat Copilot
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {[
            { icon: Mic2, label: "100% voice-only applications", desc: "No typing or reading required" },
            { icon: Users, label: "Dual-sided platform", desc: "Citizens + officials, not just a chatbot" },
            { icon: ShieldCheck, label: "Auto-escalation", desc: "RTI drafts & SLA breach alerts" },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm"
            >
              <card.icon className="mb-3 h-7 w-7 text-indigo-400" />
              <h3 className="font-semibold text-white">{card.label}</h3>
              <p className="mt-1 text-sm text-slate-400">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
