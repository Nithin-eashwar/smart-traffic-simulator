import React, { useState } from "react";
import { formatSimulationTime } from "../../utils/calculations";
import "./SimulationControls.css";

const SimulationControls = ({
  config,
  onConfigUpdate,
  onSimulationControl,
  simulationTime,
}) => {
  const [simulationMode, setSimulationMode] = useState("smart");
  const [isPaused, setIsPaused] = useState(false);

  const modes = [
    {
      id: "smart",
      label: "Smart AI",
      icon: "🧠",
      description: "AI-powered priority system",
    },
    {
      id: "fixed",
      label: "Fixed Timer",
      icon: "⏱️",
      description: "Fixed time intervals",
    },
    {
      id: "manual",
      label: "Manual",
      icon: "👨‍💼",
      description: "Manual control",
    },
    {
      id: "rush",
      label: "Rush Hour",
      icon: "🏃",
      description: "Simulate peak traffic",
    },
  ];

  const handleConfigChange = (key, value) => {
    if (onConfigUpdate) {
      onConfigUpdate(key, value);
    }
  };

  const handleSimulationAction = (action) => {
    if (onSimulationControl) {
      onSimulationControl(action);
    }

    if (action === "pause") {
      setIsPaused(!isPaused);
    }
  };

  const handleModeChange = (modeId) => {
    setSimulationMode(modeId);
    console.log("Simulation mode changed to:", modeId);
  };

  return (
    <div className="simulation-controls">
      <div className="simulation-header">
        <h3>⚙️ Simulation Controls</h3>
        <div className="time-display">
          <span className="time-label">Simulation Time:</span>
          <span className="time-value">
            {formatSimulationTime(simulationTime || 0)}
          </span>
        </div>
      </div>

      <div className="control-section">
        <h4>Simulation Mode</h4>
        <div className="mode-selector">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-btn ${
                simulationMode === mode.id ? "active" : ""
              }`}
              onClick={() => handleModeChange(mode.id)}
              title={mode.description}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-label">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h4>Simulation Parameters</h4>

        <div className="slider-control">
          <div className="slider-header">
            <label>Green Signal Duration</label>
            <span className="slider-value">{config.greenDuration}s</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={config.greenDuration}
            onChange={(e) =>
              handleConfigChange("greenDuration", parseInt(e.target.value))
            }
            className="slider"
          />
          <div className="slider-ticks">
            <span>10s</span>
            <span>35s</span>
            <span>60s</span>
          </div>
        </div>

        <div className="slider-control">
          <div className="slider-header">
            <label>Vehicle Arrival Rate</label>
            <span className="slider-value">{config.vehicleRate}/min</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={config.vehicleRate}
            onChange={(e) =>
              handleConfigChange("vehicleRate", parseInt(e.target.value))
            }
            className="slider"
          />
          <div className="slider-ticks">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>

        <div className="slider-control">
          <div className="slider-header">
            <label>Emergency Probability</label>
            <span className="slider-value">{config.emergencyProbability}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={config.emergencyProbability}
            onChange={(e) =>
              handleConfigChange(
                "emergencyProbability",
                parseInt(e.target.value)
              )
            }
            className="slider"
          />
          <div className="slider-ticks">
            <span>0%</span>
            <span>5%</span>
            <span>10%</span>
          </div>
        </div>

        <div className="slider-control">
          <div className="slider-header">
            <label>Simulation Speed</label>
            <span className="slider-value">{config.simulationSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={config.simulationSpeed}
            onChange={(e) =>
              handleConfigChange("simulationSpeed", parseFloat(e.target.value))
            }
            className="slider"
          />
          <div className="slider-ticks">
            <span>0.5x</span>
            <span>1x</span>
            <span>5x</span>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h4>Simulation Actions</h4>
        <div className="action-buttons">
          <button
            className={`action-btn ${isPaused ? "play" : "pause"}`}
            onClick={() => handleSimulationAction("pause")}
          >
            {isPaused ? "▶️ Play" : "⏸️ Pause"}
          </button>
          <button
            className="action-btn reset"
            onClick={() => handleSimulationAction("reset")}
          >
            🔄 Reset
          </button>
          <button
            className="action-btn step"
            onClick={() => handleSimulationAction("step")}
          >
            ⏭️ Step
          </button>
        </div>
      </div>

      <div className="control-section">
        <h4>Scenario Presets</h4>
        <div className="scenario-buttons">
          <button className="scenario-btn rush-hour">🏃 Rush Hour</button>
          <button className="scenario-btn night">🌙 Night Mode</button>
          <button className="scenario-btn accident">🚧 Accident</button>
          <button className="scenario-btn parade">🎉 Parade</button>
        </div>
      </div>

      <div className="simulation-info">
        <div className="info-item">
          <span className="info-label">Current Mode:</span>
          <span className="info-value">
            {modes.find((m) => m.id === simulationMode)?.label || "Smart AI"}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Status:</span>
          <span
            className={`info-value status ${isPaused ? "paused" : "running"}`}
          >
            {isPaused ? "⏸️ Paused" : "▶️ Running"}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Next Signal Change:</span>
          <span className="info-value">~{config.greenDuration}s</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
