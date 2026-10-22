import { useState } from "react";
import Header, { type AppMode, type TabName } from "./components/Header";
import { useWaterQualityData } from "./hooks/useWaterQualityData";
import AlertsPage from "./pages/AlertsPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import MonitoringPage from "./pages/MonitoringPage";
import PredictionsPage from "./pages/PredictionsPage";
import { DEMO_DEVICE_ID, REAL_DEVICE_ID } from "./services/waterQualityService";

export default function App() {
  const [tab, setTab] = useState<TabName>("Dashboard");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [mode, setMode] = useState<AppMode>(() => {
    const saved = localStorage.getItem("wq-mode");
    return saved === "real" ? "real" : "demo"; // demo first: shows recorded data immediately
  });

  const changeMode = (m: AppMode) => {
    localStorage.setItem("wq-mode", m);
    setMode(m);
  };

  // Same functions for both modes — only the device (data source) differs.
  const deviceId = mode === "demo" ? DEMO_DEVICE_ID : REAL_DEVICE_ID;
  const data = useWaterQualityData(deviceId, mode === "demo", autoRefresh);

  return (
    <div className="min-h-screen">
      <Header
        device={data.device}
        activeTab={tab}
        onNavigate={setTab}
        mode={mode}
        onModeChange={changeMode}
      />
      {tab === "Dashboard" && (
        <Dashboard
          data={data}
          mode={mode}
          autoRefresh={autoRefresh}
          onToggleRefresh={() => setAutoRefresh((v) => !v)}
        />
      )}
      {tab === "Monitoring" && <MonitoringPage data={data} mode={mode} />}
      {tab === "Historical Data" && <HistoryPage data={data} mode={mode} deviceId={deviceId} />}
      {tab === "Predictions" && <PredictionsPage data={data} mode={mode} />}
      {tab === "Alerts" && <AlertsPage data={data} mode={mode} />}
    </div>
  );
}
