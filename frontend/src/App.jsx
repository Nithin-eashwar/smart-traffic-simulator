import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSimulation } from "./hooks/useSimulation";
import Intersection from "./components/Simulation3D/Intersection";
import MetricsPanel from "./components/Metrics/MetricsPanel";
import ControlPanel from "./components/Controls/ControlPanel";
import Header from "./components/Layout/Header";
import SidePanels from "./components/Layout/SidePanels";
import simulationService from "./services/simulationService";
import "./App.css";

function App() {
  const { simulationState, isConnected, loading, error } = useSimulation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  // Handle quick actions from sidebar
  const handleQuickAction = async (action) => {
    switch (action) {
      case "start":
        try {
          await simulationService.controlSimulation("start");
          console.log("Simulation started");
        } catch (err) {
          console.error("Failed to start:", err);
        }
        break;
      case "emergency":
        // Add emergency to a random direction
        const directions = [0, 45, 90, 135, 180, 225, 270, 315];
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        try {
          await simulationService.addEmergencyVehicle(randomDir);
          console.log("Emergency vehicle added to direction:", randomDir);
        } catch (err) {
          console.error("Failed to add emergency:", err);
        }
        break;
      case "pause":
        try {
          await simulationService.controlSimulation("pause");
          console.log("Simulation paused");
        } catch (err) {
          console.error("Failed to pause:", err);
        }
        break;
      case "reset":
        try {
          await simulationService.controlSimulation("reset");
          console.log("Simulation reset");
        } catch (err) {
          console.error("Failed to reset:", err);
        }
        break;
      default:
        console.log("Action:", action);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Connecting to Traffic Control System...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Connection Error</h2>
        <p>{error}</p>
        <p>Please make sure the backend server is running on http://localhost:8000</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Render the 3D simulation canvas
  const render3DSimulation = () => (
    <div className="visualization-container">
      <Canvas
        camera={{
          position: [0, 30, 35],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        shadows
      >
        <color attach="background" args={["#0a161c"]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {simulationState && (
          <Intersection simulationState={simulationState} />
        )}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
        />


      </Canvas>
    </div>
  );

  // Render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="dashboard-view">
            <div className="dashboard-main">
              {render3DSimulation()}
              <div className="dashboard-summary">
                <div className="summary-cards">
                  <div className="summary-card">
                    <span className="summary-icon">🚗</span>
                    <div className="summary-info">
                      <span className="summary-value">
                        {simulationState?.metrics?.vehicles_processed || 0}
                      </span>
                      <span className="summary-label">Vehicles Processed</span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <span className="summary-icon">⏱️</span>
                    <div className="summary-info">
                      <span className="summary-value">
                        {simulationState?.metrics?.avg_wait_time?.toFixed(1) || "0.0"} min
                      </span>
                      <span className="summary-label">Avg Wait Time</span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <span className="summary-icon">🚦</span>
                    <div className="summary-info">
                      <span className="summary-value">
                        {simulationState?.metrics?.signal_changes || 0}
                      </span>
                      <span className="summary-label">Signal Changes</span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <span className="summary-icon">🚨</span>
                    <div className="summary-info">
                      <span className="summary-value">
                        {simulationState?.metrics?.emergency_vehicles || 0}
                      </span>
                      <span className="summary-label">Emergencies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "simulation":
        return (
          <div className="simulation-view">
            <div className="simulation-main">
              {render3DSimulation()}
            </div>
            <div className="simulation-controls">
              <ControlPanel
                simulationState={simulationState}
                isConnected={isConnected}
              />
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="analytics-view">
            <MetricsPanel metrics={simulationState?.metrics} />
          </div>
        );

      case "reports":
        return (
          <div className="reports-view">
            <div className="placeholder-content">
              <span className="placeholder-icon">📋</span>
              <h2>Reports</h2>
              <p>Traffic reports and historical data will be available here.</p>
              <div className="report-summary">
                <h3>Quick Stats</h3>
                <ul>
                  <li>Total Simulation Time: {simulationState?.simulation_time || 0} minutes</li>
                  <li>Total Vehicles Processed: {simulationState?.metrics?.vehicles_processed || 0}</li>
                  <li>CO2 Saved: {simulationState?.metrics?.co2_saved?.toFixed(1) || 0} kg</li>
                  <li>Fuel Saved: {simulationState?.metrics?.fuel_saved?.toFixed(1) || 0} L</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="settings-view">
            <div className="placeholder-content">
              <span className="placeholder-icon">⚙️</span>
              <h2>Settings</h2>
              <p>Configure your traffic control system preferences.</p>
              <div className="settings-section">
                <h3>Simulation Settings</h3>
                <div className="setting-item">
                  <label>Green Signal Duration</label>
                  <span>{simulationState?.green_duration || 30}s</span>
                </div>
                <div className="setting-item">
                  <label>System Status</label>
                  <span className={isConnected ? "status-on" : "status-off"}>
                    {isConnected ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return render3DSimulation();
    }
  };

  return (
    <div className="app">
      <Header
        isConnected={isConnected}
        simulationTime={simulationState?.simulation_time}
      />

      <div className="main-content">
        <SidePanels
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView}
          onViewChange={setActiveView}
          onQuickAction={handleQuickAction}
        />

        <div className={`content-area ${sidebarCollapsed ? "expanded" : ""}`}>
          {renderContent()}
        </div>
      </div>

      <footer className="app-footer">
        <div className="footer-info">
          <span>Smart Traffic Control System v1.0</span>
          <span>•</span>
          <span>8-Way Intersection Simulation</span>
          <span>•</span>
          <span>Priority Queue Algorithm</span>
          <span>•</span>
          <span
            className={`connection-status ${
              isConnected ? "connected" : "disconnected"
            }`}
          >
            {isConnected ? "🟢 LIVE" : "🔴 OFFLINE"}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
