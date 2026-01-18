import React, { useState } from "react";
import EmergencyControls from "./EmergencyControls";
import SimulationControls from "./SimulationControls";
import RoadControls from "./RoadControls";
import simulationService from "../../services/simulationService";
import "./ControlPanel.css";

const ControlPanel = ({ simulationState, isConnected }) => {
  const [activeTab, setActiveTab] = useState("emergency");
  const [simulationMode, setSimulationMode] = useState("smart");
  const [config, setConfig] = useState({
    greenDuration: 30,
    vehicleRate: 5,
    emergencyProbability: 2,
    simulationSpeed: 1,
  });

  // Handle mode change with preset configuration
  const handleModeChange = async (modeId, presetConfig) => {
    setSimulationMode(modeId);
    setConfig(presetConfig);

    try {
      // Update backend with new configuration
      await simulationService.updateConfig({
        greenDuration: presetConfig.greenDuration,
        vehicleRate: presetConfig.vehicleRate,
      });
      
      // Update speed separately
      await simulationService.setSpeed(presetConfig.simulationSpeed);
      
      console.log("Mode changed to:", modeId, "with config:", presetConfig);
    } catch (error) {
      console.error("Failed to update config for mode change:", error);
    }
  };

  const handleConfigUpdate = async (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);

    try {
      // Handle speed separately
      if (key === "simulationSpeed") {
        await simulationService.setSpeed(value);
        console.log("Speed updated to:", value);
        return;
      }

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

  const handleRoadControl = async (direction, action) => {
    try {
      const result = await simulationService.roadControl(direction, action);
      console.log(`Road control: ${action} on direction ${direction}`, result);
    } catch (error) {
      console.error("Failed to control road:", error);
    }
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
  ];

  return (
    <div className="control-panel">
      <div className="control-header">
        <h2>Control Panel</h2>
        <div className="connection-status">
          <div
            className={`status-dot ${isConnected ? "connected" : "disconnected"
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
            onModeChange={handleModeChange}
            simulationMode={simulationMode}
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
      </div>
    </div>
  );
};

export default ControlPanel;
