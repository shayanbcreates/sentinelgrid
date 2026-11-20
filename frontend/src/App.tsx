import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavSidebar } from "@/components/ui/NavSidebar";
import { DashboardPage } from "@/pages/DashboardPage";
import { EnvironmentsPage } from "@/pages/EnvironmentsPage";
import { SimulationStudioPage } from "@/pages/SimulationStudioPage";
import { IncidentsPage } from "@/pages/IncidentsPage";
import { EventsPage } from "@/pages/EventsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-surface text-white overflow-hidden">
        <NavSidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/environments" element={<EnvironmentsPage />} />
            <Route path="/studio" element={<SimulationStudioPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/events" element={<EventsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
