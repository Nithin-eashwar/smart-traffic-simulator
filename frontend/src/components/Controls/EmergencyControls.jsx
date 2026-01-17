import React from "react";
import "./EmergencyControls.css";

const EmergencyControls = ({ currentGreen, onAddEmergency }) => {
  const directions = [
    { angle: 0, name: "NORTH", arrow: "↑", color: "#3498db" },
    { angle: 45, name: "NORTHEAST", arrow: "↗", color: "#2ecc71" },
    { angle: 90, name: "EAST", arrow: "→", color: "#e74c3c" },
    { angle: 135, name: "SOUTHEAST", arrow: "↘", color: "#9b59b6" },
    { angle: 180, name: "SOUTH", arrow: "↓", color: "#1abc9c" },
    { angle: 225, name: "SOUTHWEST", arrow: "↙", color: "#f39c12" },
    { angle: 270, name: "WEST", arrow: "←", color: "#34495e" },
    { angle: 315, name: "NORTHWEST", arrow: "↖", color: "#7f8c8d" },
  ];

  const handleEmergencyClick = (direction) => {
    if (onAddEmergency) {
      onAddEmergency(direction.angle);
    }
  };

  const handleQuickEmergency = () => {
    // Add emergency to the most congested direction
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    onAddEmergency(randomDirection.angle);
  };

  return (
    <div className="emergency-controls">
      <div className="emergency-header">
        <h3>🚨 Emergency Vehicle Control</h3>
        <p className="emergency-subtitle">
          Add emergency vehicles to specific roads
        </p>
      </div>

      <div className="direction-grid">
        {directions.map((dir) => (
          <button
            key={dir.angle}
            className={`direction-btn ${
              currentGreen === dir.angle ? "active-green" : ""
            }`}
            onClick={() => handleEmergencyClick(dir)}
            style={{ borderColor: dir.color }}
            title={`Add emergency vehicle from ${dir.name}`}
          >
            <div className="direction-content">
              <div className="direction-arrow" style={{ color: dir.color }}>
                {dir.arrow}
              </div>
              <div className="direction-name">{dir.name}</div>
              <div className="direction-angle">{dir.angle}°</div>
            </div>
            {currentGreen === dir.angle && (
              <div className="green-indicator">
                <div className="green-pulse"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="emergency-actions">
        <button
          className="action-btn quick-emergency"
          onClick={handleQuickEmergency}
        >
          🚨 Quick Emergency
        </button>

        <button className="action-btn clear-all">
          🗑️ Clear All Emergencies
        </button>
      </div>

      <div className="emergency-info">
        <div className="info-card">
          <div className="info-icon">⚠️</div>
          <div className="info-content">
            <h4>Emergency Protocol</h4>
            <p>
              Emergency vehicles get highest priority and clear traffic
              immediately
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">🎯</div>
          <div className="info-content">
            <h4>Priority System</h4>
            <p>Emergency Public Transport Regular Vehicles</p>
          </div>
        </div>
      </div>

      <div className="emergency-stats">
        <h4>Recent Emergency Actions</h4>
        <div className="stats-list">
          <div className="stat-item">
            <span className="stat-time">2 min ago</span>
            <span className="stat-action">Emergency added to NORTH</span>
          </div>
          <div className="stat-item">
            <span className="stat-time">5 min ago</span>
            <span className="stat-action">Emergency cleared from EAST</span>
          </div>
          <div className="stat-item">
            <span className="stat-time">8 min ago</span>
            <span className="stat-action">Priority override activated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyControls;
