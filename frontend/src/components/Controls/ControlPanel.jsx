import React, { useState } from "react";
import EmergencyControls from "./EmergencyControls";
import SimulationControls from "./SimulationControls";
import RoadControls from "./RoadControls";
import simulationService from "../../services/simulationService";
import "./ControlPanel.css";

const ControlPanel = ({ simulationState, isConnected }) => {
  const [activeTab, setActiveTab] = useState("emergency");
  const [config, setConfig] = useState({
    greenDuration: 30,
    vehicleRate: 5,
    emergencyProbability: 2,
    simulationSpeed: 1,
  });

  const handleConfigUpdate = async (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    try {
      // Call the backend API to update configuration
      await simulationService.updateConfig({
        greenDuration: newConfig.greenDuration,
        vehicleRate: newConfig.vehicleRate,
      });
      console.log("Config updated successfully:", newConfig);
    } catch (error) {
      console.error("Failed to update config:", error);
    }
  };

  const handleAddEmergency = async (direction) => {
    try {
      // Call the backend API to add emergency vehicle
      const result = await simulationService.addEmergencyVehicle(direction);
      console.log("Emergency vehicle added:", result);
    } catch (error) {
      console.error("Failed to add emergency vehicle:", error);
    }
  };

  const handleRoadControl = (direction, action) => {
    console.log(`${action} road ${direction}`);
    // Road-specific controls not implemented in backend yet
  };

  const handleSimulationControl = async (action) => {
    try {
      // Call the backend API to control simulation
      const result = await simulationService.controlSimulation(action);
      console.log("Simulation control:", action, result);
    } catch (error) {
      console.error("Failed to control simulation:", error);
    }
  };

  const tabs = [
    { id: "emergency", label: "🚨 Emergency", icon: "🚨" },
    { id: "simulation", label: "⚙️ Simulation", icon: "⚙️" },
    { id: "roads", label: "🛣️ Roads", icon: "🛣️" },
    { id: "system", label: "📊 System", icon: "📊" },
  ];

  return (
    <div className="control-panel">
      <div className="control-header">
        <h2>Control Panel</h2>
        <div className="connection-status">
          <div
            className={`status-dot ${
              isConnected ? "connected" : "disconnected"
            }`}
          />
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="control-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="control-content">
        {activeTab === "emergency" && (
          <EmergencyControls
            currentGreen={simulationState?.current_green}
            onAddEmergency={handleAddEmergency}
          />
        )}

        {activeTab === "simulation" && (
          <SimulationControls
            config={config}
            onConfigUpdate={handleConfigUpdate}
            onSimulationControl={handleSimulationControl}
            simulationTime={simulationState?.simulation_time}
          />
        )}

        {activeTab === "roads" && (
          <RoadControls
            roads={simulationState?.roads}
            currentGreen={simulationState?.current_green}
            onRoadControl={handleRoadControl}
          />
        )}

        {activeTab === "system" && (
          <div className="system-controls">
            <h3>System Status</h3>
            <div className="system-info">
              <div className="info-item">
                <span className="info-label">Simulation Time:</span>
                <span className="info-value">
                  {simulationState?.simulation_time || 0} minutes
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Vehicles Processed:</span>
                <span className="info-value">
                  {simulationState?.metrics?.vehicles_processed || 0}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Signal Changes:</span>
                <span className="info-value">
                  {simulationState?.metrics?.signal_changes || 0}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Queue Size:</span>
                <span className="info-value">
                  {simulationState?.queue_size || 0}
                </span>
              </div>
            </div>

            <div className="system-actions">
              <button className="action-btn restart">🔄 Restart System</button>
              <button className="action-btn reset">♻️ Reset Data</button>
              <button className="action-btn export">📤 Export Logs</button>
            </div>
          </div>
        )}
      </div>

      <div className="control-footer">
        <div className="quick-actions">
          <button className="quick-btn" title="Add Random Emergency">
            🚨
          </button>
          <button className="quick-btn" title="Pause Simulation">
            ⏸️
          </button>
          <button className="quick-btn" title="Reset View">
            🎯
          </button>
        </div>
        <div className="version-info">v1.0.0 | Smart Traffic Control</div>
      </div>
    </div>
  );
};

export default ControlPanel;
