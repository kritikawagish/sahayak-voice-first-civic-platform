import Navbar from "@/components/Navbar";
import VoiceInterface from "./VoiceInterface";

export const metadata = {
  title: "VoiceGov — Citizen Voice Interface | Sahayak",
};

export default function CitizenPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 bg-grid">
        <VoiceInterface />
      </main>
    </>
  );
}
