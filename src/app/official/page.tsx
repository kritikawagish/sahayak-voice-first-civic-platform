import Navbar from "@/components/Navbar";
import OfficialDashboard from "./OfficialDashboard";

export const metadata = {
  title: "Panchayat Copilot — Official Dashboard | Sahayak",
};

export default function OfficialPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 bg-grid">
        <OfficialDashboard />
      </main>
    </>
  );
}
