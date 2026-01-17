import React, { useState } from "react";
import "./Alerts.css";

const Alerts = ({ metrics = {} }) => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "High Congestion Detected",
      message: "Traffic density exceeded 80% on NORTH road",
      time: "2 minutes ago",
      priority: "high",
      active: true,
    },
    {
      id: 2,
      type: "info",
      title: "Emergency Vehicle Prioritized",
      message: "Emergency vehicle cleared from EAST approach",
      time: "5 minutes ago",
      priority: "medium",
      active: true,
    },
    {
      id: 3,
      type: "success",
      title: "Wait Time Improved",
      message: "Average wait time reduced by 15%",
      time: "10 minutes ago",
      priority: "low",
      active: true,
    },
    {
      id: 4,
      type: "critical",
      title: "System Alert",
      message: "Priority queue experiencing high load",
      time: "15 minutes ago",
      priority: "critical",
      active: true,
    },
  ]);

  const systemAlerts = [
    {
      id: "congestion",
      active: (metrics.congestion_level || 0) >= 80,
      message: `High congestion: ${
        metrics.congestion_level?.toFixed(1) || "0"
      }%`,
      level: "critical",
    },
    {
      id: "waitTime",
      active: (metrics.avg_wait_time || 0) > 10,
      message: `High wait time: ${
        metrics.avg_wait_time?.toFixed(1) || "0"
      } min`,
      level: "warning",
    },
    {
      id: "emergency",
      active: (metrics.emergency_vehicles || 0) > 0,
      message: `${metrics.emergency_vehicles || 0} emergency vehicle(s) active`,
      level: "info",
    },
    {
      id: "throughput",
      active: (metrics.throughput || 0) < 100,
      message: `Low throughput: ${
        metrics.throughput?.toFixed(0) || "0"
      } veh/hr`,
      level: "warning",
    },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical":
        return "🚨";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
      default:
        return "📢";
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "critical":
        return "#e74c3c";
      case "warning":
        return "#f39c12";
      case "info":
        return "#3498db";
      case "success":
        return "#2ecc71";
      default:
        return "#7f8c8d";
    }
  };

  const dismissAlert = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, active: false } : alert
      )
    );
  };

  const dismissAll = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, active: false })));
  };

  const activeAlerts = alerts.filter((alert) => alert.active);

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h3>🚨 System Alerts</h3>
        <div className="alerts-count">
          <span className="count-badge">{activeAlerts.length}</span>
          <span className="count-label">Active Alerts</span>
        </div>
      </div>

      <div className="system-status">
        <h4>Real-time Status</h4>
        <div className="status-grid">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`status-indicator ${
                alert.active ? "active" : "inactive"
              } ${alert.level}`}
            >
              <div className="status-icon">{getAlertIcon(alert.level)}</div>
              <div className="status-message">{alert.message}</div>
              <div className="status-dot"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="alerts-list">
        <div className="list-header">
          <h4>Recent Notifications</h4>
          {activeAlerts.length > 0 && (
            <button className="dismiss-all-btn" onClick={dismissAll}>
              Dismiss All
            </button>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div className="no-alerts">
            <div className="no-alerts-icon">🎯</div>
            <p className="no-alerts-message">All systems operational</p>
            <p className="no-alerts-sub">No active alerts</p>
          </div>
        ) : (
          <div className="alerts-scroll">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-item ${alert.type}`}
                style={{ borderLeftColor: getAlertColor(alert.type) }}
              >
                <div className="alert-icon">{getAlertIcon(alert.type)}</div>
                <div className="alert-content">
                  <div className="alert-header">
                    <h5 className="alert-title">{alert.title}</h5>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                </div>
                <button
                  className="dismiss-btn"
                  onClick={() => dismissAlert(alert.id)}
                  title="Dismiss alert"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="alerts-summary">
        <div className="summary-item">
          <div className="summary-label">Critical</div>
          <div className="summary-value critical">
            {alerts.filter((a) => a.type === "critical" && a.active).length}
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Warning</div>
          <div className="summary-value warning">
            {alerts.filter((a) => a.type === "warning" && a.active).length}
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Info</div>
          <div className="summary-value info">
            {alerts.filter((a) => a.type === "info" && a.active).length}
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Total</div>
          <div className="summary-value total">{activeAlerts.length}</div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
