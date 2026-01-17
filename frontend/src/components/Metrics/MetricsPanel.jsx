import React, { useMemo } from "react";
import MetricCard from "./MetricCard";
import WaitTimeChart from "./Charts/WaitTimeChart";
import DensityChart from "./Charts/DensityChart";
import EnvironmentalChart from "./Charts/EnvironmentalChart";
import Alerts from "./Alerts";
import "./MetricsPanel.css";

const MetricsPanel = ({ metrics = {} }) => {
  const metricData = useMemo(() => {
    if (!metrics) return [];

    return [
      {
        key: "avg_wait_time",
        label: "Average Wait Time",
        value: metrics.avg_wait_time?.toFixed(1) || "0.0",
        unit: "min",
        icon: "⏱️",
        color: "#3498db",
        trend: -12.5,
        description: "Reduced by 12.5% compared to fixed timer",
      },
      {
        key: "congestion_level",
        label: "Congestion Level",
        value: metrics.congestion_level?.toFixed(1) || "0.0",
        unit: "%",
        icon: "🚗",
        color: "#2ecc71",
        trend: -8.3,
        description: "Overall traffic density",
      },
      {
        key: "emergency_vehicles",
        label: "Emergency Vehicles",
        value: metrics.emergency_vehicles || 0,
        unit: "served",
        icon: "🚨",
        color: "#e74c3c",
        trend: 45,
        description: "Prioritized in last hour",
      },
      {
        key: "throughput",
        label: "Throughput",
        value: metrics.throughput?.toFixed(0) || "0",
        unit: "veh/hr",
        icon: "📊",
        color: "#9b59b6",
        trend: 15.2,
        description: "Vehicles processed per hour",
      },
      {
        key: "co2_saved",
        label: "CO2 Saved",
        value: metrics.co2_saved?.toFixed(1) || "0.0",
        unit: "kg",
        icon: "🌱",
        color: "#1abc9c",
        trend: 18.7,
        description: "Emissions reduced",
      },
      {
        key: "fuel_saved",
        label: "Fuel Saved",
        value: metrics.fuel_saved?.toFixed(1) || "0.0",
        unit: "L",
        icon: "⛽",
        color: "#f39c12",
        trend: 22.3,
        description: "Fuel consumption reduced",
      },
      {
        key: "vehicles_processed",
        label: "Vehicles Processed",
        value: metrics.vehicles_processed || 0,
        unit: "",
        icon: "🚘",
        color: "#3498db",
        trend: 8.9,
        description: "Total vehicles cleared",
      },
      {
        key: "signal_changes",
        label: "Signal Changes",
        value: metrics.signal_changes || 0,
        unit: "",
        icon: "🚦",
        color: "#2ecc71",
        trend: -5.4,
        description: "Traffic signal changes",
      },
    ];
  }, [metrics]);

  const systemHealth = useMemo(() => {
    const congestion = metrics.congestion_level || 0;
    const waitTime = metrics.avg_wait_time || 0;
    const throughput = metrics.throughput || 0;

    // Calculate system health score (0-100)
    const healthScore = 100 - congestion / 2 - Math.min(waitTime, 10) * 2;

    let status = "Excellent";
    let color = "#2ecc71";

    if (healthScore < 70) {
      status = "Good";
      color = "#f1c40f";
    }
    if (healthScore < 50) {
      status = "Fair";
      color = "#e67e22";
    }
    if (healthScore < 30) {
      status = "Poor";
      color = "#e74c3c";
    }

    return {
      score: Math.max(0, Math.min(100, healthScore)).toFixed(1),
      status,
      color,
    };
  }, [metrics]);

  return (
    <div className="metrics-panel">
      <div className="panel-header">
        <h2>📊 Performance Metrics</h2>
        <div className="health-indicator">
          <div className="health-score" style={{ color: systemHealth.color }}>
            {systemHealth.score}%
          </div>
          <div className="health-status" style={{ color: systemHealth.color }}>
            {systemHealth.status}
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {metricData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <WaitTimeChart metricsHistory={[]} />
        </div>
        <div className="chart-container">
          <DensityChart roads={{}} />
        </div>
        <div className="chart-container full-width">
          <EnvironmentalChart metricsHistory={[]} />
        </div>
      </div>

      <div className="alerts-section">
        <Alerts metrics={metrics} />
      </div>

      <div className="stakeholder-section">
        <h3>Stakeholder Impact</h3>
        <div className="stakeholder-grid">
          <div className="stakeholder-card police">
            <div className="stakeholder-icon">👮</div>
            <div className="stakeholder-content">
              <h4>Traffic Police</h4>
              <p>Response time improved by 35%</p>
              <div className="impact-meter">
                <div className="meter-fill" style={{ width: "85%" }}></div>
                <span>85% Efficiency</span>
              </div>
            </div>
          </div>

          <div className="stakeholder-card emergency">
            <div className="stakeholder-icon">🚑</div>
            <div className="stakeholder-content">
              <h4>Emergency Services</h4>
              <p>Clearance time reduced by 42%</p>
              <div className="impact-meter">
                <div className="meter-fill" style={{ width: "92%" }}></div>
                <span>92% Efficiency</span>
              </div>
            </div>
          </div>

          <div className="stakeholder-card commuters">
            <div className="stakeholder-icon">👥</div>
            <div className="stakeholder-content">
              <h4>Commuters</h4>
              <p>Average wait time down 28%</p>
              <div className="impact-meter">
                <div className="meter-fill" style={{ width: "78%" }}></div>
                <span>78% Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="stakeholder-card environment">
            <div className="stakeholder-icon">🌍</div>
            <div className="stakeholder-content">
              <h4>Environment</h4>
              <p>Emissions reduced by 18%</p>
              <div className="impact-meter">
                <div className="meter-fill" style={{ width: "82%" }}></div>
                <span>82% Improvement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
