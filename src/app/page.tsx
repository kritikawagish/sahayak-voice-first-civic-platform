import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Impact from "@/components/Impact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Impact />
      </main>
      <footer className="border-t border-white/10 bg-slate-950 py-8 text-center text-sm text-slate-500">
        Sahayak — VoiceGov + Panchayat Copilot · Smart Bharat Hackathon
      </footer>
    </>
  );
}
