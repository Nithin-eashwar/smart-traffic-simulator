import React from "react";
import "./SidePanels.css";

const SidePanels = ({ collapsed, onToggle, activeView, onViewChange, onQuickAction }) => {
  const navigationItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "simulation", icon: "🚦", label: "Simulation" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "reports", icon: "📋", label: "Reports" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const quickActions = [
    { id: "emergency", icon: "🚨", label: "Add Emergency", color: "#e74c3c" },
    { id: "pause", icon: "⏸️", label: "Pause Sim", color: "#f39c12" },
    { id: "reset", icon: "🔁", label: "Reset Sim", color: "#3498db" },
    { id: "screenshot", icon: "📸", label: "Screenshot", color: "#9b59b6" },
  ];

  const systemStatus = [
    { label: "AI Controller", status: "active", value: "Running" },
    { label: "Sensors", status: "active", value: "8/8 Active" },
    { label: "Database", status: "active", value: "Connected" },
    { label: "Network", status: "active", value: "Stable" },
  ];

  const handleNavigationClick = (itemId) => {
    if (onViewChange) {
      onViewChange(itemId);
    }
  };

  const handleQuickActionClick = (actionId) => {
    if (onQuickAction) {
      onQuickAction(actionId);
    }
  };

  return (
    <aside className={`side-panels ${collapsed ? "collapsed" : ""}`}>
      <div className="panel-header">
        {!collapsed && (
          <div className="panel-title">
            <h2>🚦 Traffic Control</h2>
          </div>
        )}
        <button
          className="toggle-panel-btn"
          onClick={onToggle}
          title={collapsed ? "Expand Panel" : "Collapse Panel"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {!collapsed && (
        <>
          <nav className="navigation-panel">
            <h3 className="panel-section-title">
              <span className="section-icon">🧭</span>
              Navigation
            </h3>
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${
                      activeView === item.id ? "active" : ""
                    }`}
                    onClick={() => handleNavigationClick(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {activeView === item.id && <div className="active-indicator" />}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="quick-actions-panel">
            <h3 className="panel-section-title">
              <span className="section-icon">⚡</span>
              Quick Actions
            </h3>
            <div className="action-grid">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="action-item"
                  style={{ "--action-color": action.color }}
                  title={action.label}
                  onClick={() => handleQuickActionClick(action.id)}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="system-status-panel">
            <h3 className="panel-section-title">
              <span className="section-icon">💡</span>
              System Status
            </h3>
            <div className="status-list">
              {systemStatus.map((status, index) => (
                <div key={index} className="status-item">
                  <div className="status-info">
                    <span className="status-label">{status.label}</span>
                    <span className="status-value">{status.value}</span>
                  </div>
                  <div className={`status-indicator ${status.status}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel-footer">
            <div className="footer-info">
              <span className="version">v1.0.0</span>
              <span className="time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </>
      )}

      {collapsed && (
        <div className="collapsed-view">
          <div className="collapsed-nav">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`collapsed-nav-item ${activeView === item.id ? "active" : ""}`}
                title={item.label}
                onClick={() => handleNavigationClick(item.id)}
              >
                <span className="collapsed-icon">{item.icon}</span>
              </button>
            ))}
          </div>
          <div className="collapsed-divider" />
          <div className="collapsed-actions">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="collapsed-action"
                title={action.label}
                onClick={() => handleQuickActionClick(action.id)}
              >
                <span className="collapsed-action-icon">{action.icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidePanels;
