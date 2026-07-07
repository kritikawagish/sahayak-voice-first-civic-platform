"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCcw,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

type QueueItem = {
  id: number;
  type: "application" | "complaint";
  referenceNumber: string;
  title: string;
  citizenName: string | null;
  status: string;
  priority: number;
  createdAt: Date | null;
};

type Official = {
  id: number;
  name: string;
  role: string;
  jurisdiction: string | null;
  workloadScore: number | null;
};

function draftResponse(item: QueueItem): string {
  if (item.type === "application") {
    if (item.status === "pending") {
      return `Dear applicant, your ${item.title} application (${item.referenceNumber}) is under initial review. Please submit any missing documents to the panchayat office within 7 days.`;
    }
    return `Dear applicant, your ${item.title} application (${item.referenceNumber}) has been processed. You will receive an update shortly.`;
  }
  return `Dear resident, your ${item.title} (${item.referenceNumber}) has been noted. The concerned department has been directed to inspect the site and resolve the issue within the SLA.`;
}

function priorityColor(priority: number) {
  if (priority >= 5) return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  if (priority >= 4) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  if (priority >= 3) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
}

export default function OfficialDashboard() {
  const [tab, setTab] = useState<"queue" | "officials" | "handover">("queue");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfficial, setSelectedOfficial] = useState<number | "">("");
  const [handover, setHandover] = useState<Record<string, unknown> | null>(null);
  const [handoverLoading, setHandoverLoading] = useState(false);
  const [loadAlert, setLoadAlert] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/official/queue");
      const data = await res.json();
      setQueue(data.queue ?? []);
      setOfficials(data.officials ?? []);
      const maxWorkload = Math.max(...(data.officials ?? []).map((o: Official) => o.workloadScore ?? 0), 0);
      setLoadAlert(maxWorkload > 75);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const pending = queue.filter((q) => q.status === "pending" || q.status === "open").length;
    const escalated = queue.filter((q) => q.status === "escalated").length;
    const highPriority = queue.filter((q) => q.priority >= 4).length;
    return { pending, escalated, highPriority, total: queue.length };
  }, [queue]);

  const respond = async (item: QueueItem, status: string) => {
    await fetch("/api/official/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: item.type,
        id: item.id,
        status,
        draft: draftResponse(item),
      }),
    });
    fetchData();
  };

  const generateHandover = async () => {
    if (!selectedOfficial) return;
    setHandoverLoading(true);
    try {
      const res = await fetch("/api/official/handover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officialId: selectedOfficial }),
      });
      const data = await res.json();
      setHandover(data.brief ?? null);
    } catch {
      setHandover(null);
    }
    setHandoverLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-24">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Panchayat Copilot</h1>
          <p className="text-slate-400">AI-drafted responses, priority triage, and institutional memory.</p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loadAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-200"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm font-medium">
            Workload alert: An official has crossed 75% capacity. Consider redistributing cases.
          </span>
        </motion.div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Cases", value: stats.total, icon: Inbox, color: "text-indigo-400" },
          { label: "Pending / Open", value: stats.pending, icon: Clock, color: "text-amber-400" },
          { label: "High Priority", value: stats.highPriority, icon: AlertTriangle, color: "text-orange-400" },
          { label: "Escalated", value: stats.escalated, icon: ShieldCheck, color: "text-rose-400" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <s.icon className={`h-6 w-6 ${s.color}`} />
            <div className="mt-3 text-3xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex gap-2 rounded-full border border-white/10 bg-white/5 p-1 w-fit">
        {(["queue", "officials", "handover"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              tab === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "queue" ? "AI Queue" : t === "officials" ? "Officials" : "Handover"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "queue" && (
          <motion.div
            key="queue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                Loading AI queue...
              </div>
            ) : queue.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                No cases in the queue yet.
              </div>
            ) : (
              <div className="space-y-4">
                {queue.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-indigo-500/30"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityColor(
                              item.priority
                            )}`}
                          >
                            Priority {item.priority}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300">
                            {item.type === "application" ? "Application" : "Complaint"}
                          </span>
                          <span className="text-xs font-mono text-slate-500">{item.referenceNumber}</span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                        <p className="text-sm text-slate-400">
                          From: {item.citizenName || "Anonymous"} • Status: {item.status} •{" "}
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                        </p>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-indigo-300">
                            <FileText className="h-3.5 w-3.5" /> AI Draft Response
                          </div>
                          <p className="text-sm text-slate-300">{draftResponse(item)}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:flex-col">
                        <button
                          onClick={() => respond(item, item.type === "application" ? "under_review" : "in_progress")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500"
                        >
                          <Clock className="h-3.5 w-3.5" /> Start Review
                        </button>
                        <button
                          onClick={() => respond(item, item.type === "application" ? "approved" : "resolved")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve / Resolve
                        </button>
                        <button
                          onClick={() => respond(item, item.type === "application" ? "rejected" : "escalated")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white hover:bg-rose-500"
                        >
                          <XCircle className="h-3.5 w-3.5" /> {item.type === "application" ? "Reject" : "Escalate"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === "officials" && (
          <motion.div
            key="officials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {officials.map((off) => (
              <div
                key={off.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 text-sm font-bold text-white">
                    {off.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{off.name}</h3>
                    <p className="text-xs text-slate-400">{off.role}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Workload</span>
                    <span>{off.workloadScore ?? 0}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full ${
                        (off.workloadScore ?? 0) > 75 ? "bg-rose-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${Math.min(off.workloadScore ?? 0, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400">{off.jurisdiction}</p>
              </div>
            ))}
          </motion.div>
        )}

        {tab === "handover" && (
          <motion.div
            key="handover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300">Select outgoing official</label>
                <select
                  value={selectedOfficial}
                  onChange={(e) => setSelectedOfficial(e.target.value ? Number(e.target.value) : "")}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Choose official</option>
                  {officials.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} — {off.role}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={generateHandover}
                disabled={!selectedOfficial || handoverLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {handoverLoading ? "Generating..." : "Generate Handover Brief"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {handover && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-white/10 bg-slate-900/60 p-5"
              >
                <h3 className="text-lg font-semibold text-white">
                  Handover Brief: {handover.official as string} ({handover.role as string})
                </h3>
                <p className="mt-1 text-sm text-slate-400">{handover.jurisdiction as string}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Workload Score
                    </h4>
                    <p className="text-2xl font-bold text-white">{handover.workloadScore as number}%</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Decision Patterns</h4>
                    <ul className="mt-1 list-disc pl-4 text-sm text-slate-300">
                      {(handover.patterns as string[]).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Advice</h4>
                  <ul className="mt-1 list-disc pl-4 text-sm text-slate-300">
                    {(handover.advice as string[]).map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
