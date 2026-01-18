import React from "react";
import "./RoadControls.css";

const RoadControls = ({ roads, currentGreen, onRoadControl }) => {
  const roadConfigs = [
    { angle: 0, name: "NORTH", lanes: 3, color: "#3498db" },
    { angle: 45, name: "NORTHEAST", lanes: 2, color: "#2ecc71" },
    { angle: 90, name: "EAST", lanes: 3, color: "#e74c3c" },
    { angle: 135, name: "SOUTHEAST", lanes: 2, color: "#9b59b6" },
    { angle: 180, name: "SOUTH", lanes: 3, color: "#1abc9c" },
    { angle: 225, name: "SOUTHWEST", lanes: 2, color: "#f39c12" },
    { angle: 270, name: "WEST", lanes: 3, color: "#34495e" },
    { angle: 315, name: "NORTHWEST", lanes: 2, color: "#7f8c8d" },
  ];

  const getRoadData = (angle) => {
    return roads?.[angle] || { vehicle_count: 0, density: 0 };
  };

  const getCongestionLevel = (density) => {
    if (density >= 80) return { level: "High", color: "#e74c3c" };
    if (density >= 60) return { level: "Medium", color: "#f39c12" };
    if (density >= 40) return { level: "Low", color: "#f1c40f" };
    return { level: "Clear", color: "#2ecc71" };
  };

  const handleRoadAction = (direction, action) => {
    if (onRoadControl) {
      onRoadControl(direction, action);
    }
  };

  const handleAllRoadsAction = (action) => {
    roadConfigs.forEach((road) => {
      onRoadControl(road.angle, action);
    });
  };

  return (
    <div className="road-controls">
      <div className="road-header">
        <h3>🛣️ Road Controls</h3>
        <p className="road-subtitle">Monitor and control individual roads</p>
      </div>

      <div className="road-list">
        {roadConfigs.map((road) => {
          const roadData = getRoadData(road.angle);
          const congestion = getCongestionLevel(roadData.density);
          const isActive = currentGreen === road.angle;

          return (
            <div
              key={road.angle}
              className={`road-item ${isActive ? "active" : ""}`}
              style={{ borderLeftColor: road.color }}
            >
              <div className="road-info">
                <div className="road-name-section">
                  <h4 className="road-name">{road.name}</h4>
                  <div className="road-lanes">
                    <span className="lane-count">{road.lanes} lanes</span>
                    {isActive && (
                      <div className="active-indicator">
                        <div className="active-pulse"></div>
                        <span>ACTIVE</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="road-stats">
                  <div className="stat">
                    <span className="stat-label">Vehicles:</span>
                    <span className="stat-value">
                      {roadData.vehicle_count || 0}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Density:</span>
                    <span className="stat-value">
                      {roadData.density?.toFixed(1) || "0.0"}%
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Status:</span>
                    <span
                      className="stat-value congestion"
                      style={{ color: congestion.color }}
                    >
                      {congestion.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="road-actions">
                <button
                  className="action-btn priority"
                  onClick={() => handleRoadAction(road.angle, "priority")}
                  title="Give priority to this road"
                >
                  ⏫ Priority
                </button>
                <button
                  className="action-btn clear"
                  onClick={() => handleRoadAction(road.angle, "clear")}
                  title="Clear vehicles from this road"
                >
                  🧹 Clear
                </button>
                <button
                  className="action-btn add"
                  onClick={() => handleRoadAction(road.angle, "add")}
                  title="Add vehicles to this road"
                >
                  ➕ Add
                </button>
              </div>

              <div className="road-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(roadData.density || 0, 100)}%`,
                      backgroundColor: congestion.color,
                    }}
                  />
                </div>
                <div className="progress-labels">
                  <span>0%</span>
                  <span>Capacity: {road.lanes * 20} vehicles</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="road-summary">
        <div className="summary-item">
          <div className="summary-icon">🚗</div>
          <div className="summary-content">
            <div className="summary-value">
              {Object.values(roads || {}).reduce(
                (sum, road) => sum + (road.vehicle_count || 0),
                0
              )}
            </div>
            <div className="summary-label">Total Vehicles</div>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-value">
              {Object.values(roads || {}).reduce(
                (sum, road) => sum + (road.density || 0),
                0
              ) / 8 || 0}
              %
            </div>
            <div className="summary-label">Avg. Density</div>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon">🚦</div>
          <div className="summary-content">
            <div className="summary-value">
              {currentGreen !== null && currentGreen !== undefined ? "1" : "0"}
            </div>
            <div className="summary-label">Active Signals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadControls;
