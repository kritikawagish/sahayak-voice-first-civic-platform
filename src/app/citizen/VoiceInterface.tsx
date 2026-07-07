"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, RefreshCcw, Phone, MessageSquareText, Languages, UserCircle2 } from "lucide-react";
import {
  type Language,
  type CitizenState,
  type ProcessResult,
  initialState,
  welcomeReply,
  processMessage,
  langCode,
  finalizeReply,
  finalizeStatusReply,
  escalateReply,
} from "@/lib/citizenFlow";

type Message = { role: "ai" | "user"; text: string };

export default function VoiceInterface() {
  const [language, setLanguage] = useState<Language>("hi");
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<CitizenState>({ ...initialState, language: "hi" });
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [input, setInput] = useState("");
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const [showTrust, setShowTrust] = useState(false);
  const [reference, setReference] = useState("");
  const [submittedType, setSubmittedType] = useState<"application" | "complaint" | null>(null);
  const [proxyMode, setProxyMode] = useState(false);
  const [proxyName, setProxyName] = useState("Local Sahayak");
  const [showRating, setShowRating] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = langCode(language);
      utter.rate = 0.95;
      utter.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang.startsWith(langCode(language).split("-")[0]));
      if (voice) utter.voice = voice;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [language]
  );

  const addMessage = useCallback((role: Message["role"], text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  }, []);

  const aiSay = useCallback(
    (text: string) => {
      addMessage("ai", text);
      speak(text);
    },
    [addMessage, speak]
  );

  useEffect(() => {
    setMessages([{ role: "ai", text: welcomeReply(language) }]);
    speak(welcomeReply(language));
    if (typeof window !== "undefined" && !(window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setSupportsSpeech(false);
    }
  }, [language, speak]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmitToServer = useCallback(
    async (result: ProcessResult) => {
      if (!result.submitData) return;
      const { type, payload } = result.submitData;
      try {
        if (type === "application") {
          const res = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          const ref = data.application?.referenceNumber ?? "N/A";
          setReference(ref);
          setSubmittedType("application");
          const final = finalizeReply(language, result.reply, ref);
          addMessage("ai", final);
          speak(final);
          setShowTrust(true);
          setTimeout(() => setSmsSent(true), 1500);
          if (proxyMode) setShowRating(true);
        } else if (type === "complaint") {
          const res = await fetch("/api/complaints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          const ref = data.complaint?.referenceNumber ?? "N/A";
          const id = data.complaint?.id;
          setReference(ref);
          setSubmittedType("complaint");
          const final = finalizeReply(language, result.reply, ref);
          addMessage("ai", final);
          speak(final);
          setShowTrust(true);
          if (proxyMode) setShowRating(true);
          // Demo SLA auto-escalation after 10 seconds
          setTimeout(async () => {
            if (!id) return;
            const esc = await fetch(`/api/complaints/${id}/escalate`, { method: "POST" });
            if (esc.ok) {
              const text = escalateReply(language);
              addMessage("ai", text);
              speak(text);
            }
          }, 10000);
        }
      } catch (e) {
        addMessage("ai", "Sorry, submission failed. Please try again.");
      }
    },
    [addMessage, language, proxyMode, speak]
  );

  const handleUserMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      addMessage("user", text);
      const result = processMessage(state, text);
      setState(result.state);

      if (result.done && result.submitData) {
        await handleSubmitToServer(result);
      } else if (result.state.mode === "status" && result.state.step === 31 && result.state.referenceNumber) {
        try {
          const res = await fetch(`/api/applications/${encodeURIComponent(result.state.referenceNumber)}`);
          const data = await res.json();
          const status = data.application?.status ?? "not found";
          const final = finalizeStatusReply(language, result.reply, status);
          addMessage("ai", final);
          speak(final);
        } catch {
          const final = finalizeStatusReply(language, result.reply, "not found");
          addMessage("ai", final);
          speak(final);
        }
      } else {
        addMessage("ai", result.reply);
        speak(result.reply);
      }
    },
    [addMessage, handleSubmitToServer, language, speak, state]
  );

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupportsSpeech(false);
      return;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    const recognition = new SR();
    recognition.lang = langCode(language);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserMessage(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, [handleUserMessage, language]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setListening(false);
  }, []);

  const onSendText = () => {
    handleUserMessage(input);
    setInput("");
  };

  const restart = () => {
    window.speechSynthesis?.cancel();
    setState({ ...initialState, language });
    setMessages([{ role: "ai", text: welcomeReply(language) }]);
    setShowTrust(false);
    setReference("");
    setSubmittedType(null);
    setShowRating(false);
    setSmsSent(false);
    speak(welcomeReply(language));
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col px-4 pb-8 pt-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
          <Languages className="h-4 w-4 text-indigo-400" />
          <span className="text-slate-300">Language:</span>
          {(["hi", "bho", "en"] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLanguage(l);
                setState((s) => ({ ...s, language: l }));
              }}
              className={`rounded-full px-2 py-0.5 text-xs font-medium transition ${
                language === l ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {l === "hi" ? "हिन्दी" : l === "bho" ? "भोजपुरी" : "English"}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
          <UserCircle2 className="h-4 w-4 text-rose-400" />
          <span>Proxy mode</span>
          <input
            type="checkbox"
            checked={proxyMode}
            onChange={(e) => setProxyMode(e.target.checked)}
            className="h-4 w-4 accent-rose-500"
          />
        </label>
      </div>

      {proxyMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4"
        >
          <input
            value={proxyName}
            onChange={(e) => setProxyName(e.target.value)}
            placeholder="Verified Sahayak name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </motion.div>
      )}

      <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div className="h-full max-h-[60vh] overflow-y-auto p-5">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-none bg-indigo-600 text-white"
                      : "rounded-bl-none border border-white/10 bg-white/5 text-slate-100"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {showTrust && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center backdrop-blur-md"
          >
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/20">
              <svg className="h-20 w-20 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute inset-0 rounded-full glow-ring" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {submittedType === "application" ? "Application Submitted" : "Complaint Registered"}
            </h3>
            <p className="mt-2 text-slate-300">Your reference number is</p>
            <div className="mt-2 rounded-xl bg-white/10 px-6 py-3 text-2xl font-mono font-bold tracking-wider text-white">
              {reference}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              A voice confirmation has been spoken. {smsSent && "An SMS with a voice note is on its way."}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20"
              >
                <RefreshCcw className="h-4 w-4" /> Start over
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={listening ? stopListening : startListening}
            className={`relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full transition ${
              listening
                ? "bg-rose-600 shadow-lg shadow-rose-900/40"
                : "bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-900/40 hover:scale-105"
            }`}
            aria-label={listening ? "Stop listening" : "Start listening"}
          >
            {listening && (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-50" />
                <span className="absolute -inset-3 rounded-full border border-rose-500/30" />
              </>
            )}
            {speaking ? (
              <div className="flex h-6 items-end gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-white animate-soundbar"
                    style={{ height: "60%", animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            ) : (
              <Mic className="h-7 w-7 text-white" />
            )}
          </button>

          <div className="flex flex-1 flex-col gap-2">
            <div className="text-xs font-medium text-slate-400">
              {listening
                ? "Listening... speak now"
                : speaking
                ? "Sahayak is speaking..."
                : supportsSpeech
                ? "Tap the mic and speak"
                : "Type your message below"}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSendText()}
                placeholder={supportsSpeech ? "Or type here..." : "Type here..."}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={onSendText}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {!supportsSpeech && (
          <p className="mt-2 text-xs text-rose-300">
            Speech recognition is not supported in this browser. Please type your replies.
          </p>
        )}
      </div>

      {showRating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-rose-900/30 to-slate-900 p-5"
        >
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <MessageSquareText className="h-4 w-4 text-rose-400" /> Rate your Sahayak
          </h4>
          <p className="mt-1 text-sm text-slate-300">How was the help you received? Tap stars.</p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={async () => {
                  await fetch("/api/proxy/rating", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      sessionType: submittedType,
                      proxyName,
                      rating: star,
                      feedback: "Voice rating",
                    }),
                  });
                  setShowRating(false);
                  addMessage("ai", `Thank you for rating ${star} stars.`);
                  speak(`Thank you for rating ${star} stars.`);
                }}
                className="text-2xl text-slate-600 transition hover:scale-110 hover:text-rose-400 focus:text-rose-400"
              >
                ★
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {smsSent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"
        >
          <Phone className="h-4 w-4" /> Voice-note SMS dispatched to registered number.
        </motion.div>
      )}
    </div>
  );
}
