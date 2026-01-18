import React from "react";
import { formatSimulationTime } from "../../utils/calculations";
import "./Header.css";

const Header = ({ isConnected, simulationTime }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">🚦</div>
          <div className="logo-text">
            <h1>Smart Traffic Control</h1>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="simulation-info">
          <div className="info-card">
            <div className="info-icon">⏱️</div>
            <div className="info-content">
              <div className="info-label">Simulation Time</div>
              <div className="info-value">
                {formatSimulationTime(simulationTime || 0)}
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🚗</div>
            <div className="info-content">
              <div className="info-label">Real-time Scale</div>
              <div className="info-value">1s = 1min</div>
            </div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="connection-status">
          <div
            className={`status-indicator ${
              isConnected ? "connected" : "disconnected"
            }`}
          />
          <div className="status-text">
            <span className="status-label">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            <span className="status-detail">
              {isConnected ? "Receiving live data" : "No connection"}
            </span>
          </div>
        </div>

        <div className="user-menu">
          <div className="user-avatar">TC</div>
          <div className="user-info">
            <span className="user-name">Traffic Control</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
