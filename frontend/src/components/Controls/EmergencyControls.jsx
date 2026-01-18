import React, { useState } from "react";
import "./EmergencyControls.css";

const EmergencyControls = ({ currentGreen, onAddEmergency }) => {
  const [loading, setLoading] = useState(null); // Track which button is loading
  const [recentActions, setRecentActions] = useState([]);
  const [lastSuccess, setLastSuccess] = useState(null);

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

  const handleEmergencyClick = async (direction) => {
    if (onAddEmergency) {
      setLoading(direction.angle);
      try {
        await onAddEmergency(direction.angle);
        // Show success feedback
        setLastSuccess(direction.angle);
        setTimeout(() => setLastSuccess(null), 2000);

        // Add to recent actions
        const newAction = {
          id: Date.now(),
          time: "Just now",
          action: `Emergency added to ${direction.name}`,
        };
        setRecentActions(prev => [newAction, ...prev].slice(0, 5));
      } catch (error) {
        console.error("Failed to add emergency:", error);
      } finally {
        setLoading(null);
      }
    }
  };

  const handleQuickEmergency = async () => {
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    await handleEmergencyClick(randomDirection);
  };

  const handleClearAll = () => {
    setRecentActions([]);
    // Add a "cleared" action to show feedback
    setRecentActions([{
      id: Date.now(),
      time: "Just now",
      action: "All emergencies cleared",
    }]);
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
            className={`direction-btn ${currentGreen === dir.angle ? "active-green" : ""
              } ${loading === dir.angle ? "loading" : ""} ${lastSuccess === dir.angle ? "success" : ""
              }`}
            onClick={() => handleEmergencyClick(dir)}
            disabled={loading !== null}
            style={{ borderColor: dir.color }}
            title={`Add emergency vehicle from ${dir.name}`}
          >
            <div className="direction-content">
              <div className="direction-arrow" style={{ color: dir.color }}>
                {loading === dir.angle ? "⏳" : dir.arrow}
              </div>
              <div className="direction-name">{dir.name}</div>
              <div className="direction-angle">{dir.angle}°</div>
            </div>
            {currentGreen === dir.angle && (
              <div className="green-indicator">
                <div className="green-pulse"></div>
              </div>
            )}
            {lastSuccess === dir.angle && (
              <div className="success-indicator">✓</div>
            )}
          </button>
        ))}
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
            <p>Emergency → Public Transport → Regular Vehicles</p>
          </div>
        </div>
      </div>

      <div className="emergency-stats">
        <h4>Recent Emergency Actions</h4>
        <div className="stats-list">
          {recentActions.length === 0 ? (
            <div className="stat-item empty">
              <span className="stat-action">No recent actions</span>
            </div>
          ) : (
            recentActions.map((action) => (
              <div key={action.id} className="stat-item new">
                <span className="stat-time">{action.time}</span>
                <span className="stat-action">{action.action}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyControls;
