"use client";

import { motion } from "framer-motion";

const metrics = [
  { value: "400M+", label: "Citizens with low digital literacy" },
  { value: "70%", label: "Applications completed via voice-only" },
  { value: "<3 min", label: "Avg. time to apply for a scheme" },
  { value: "40%", label: "Target reduction in official workload" },
];

export default function Impact() {
  return (
    <section id="impact" className="relative border-t border-white/10 bg-slate-900 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Why Sahayak wins</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Every competing team will build a chatbot for citizens. We are the only team solving the
            supply-and-demand problem simultaneously.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center"
            >
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">
                {m.value}
              </div>
              <div className="mt-2 text-sm text-slate-300">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
