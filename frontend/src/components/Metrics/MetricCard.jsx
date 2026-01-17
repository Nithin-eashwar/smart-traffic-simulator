import React from "react";
import "./MetricCard.css";

const MetricCard = ({
  label,
  value,
  unit,
  icon,
  color,
  trend,
  description,
}) => {
  const getTrendIcon = () => {
    if (trend > 0) return "📈";
    if (trend < 0) return "📉";
    return "➡️";
  };

  const getTrendClass = () => {
    if (trend > 0) return "positive";
    if (trend < 0) return "negative";
    return "neutral";
  };

  const formatTrend = (trendValue) => {
    if (trendValue > 0) return `+${Math.abs(trendValue).toFixed(1)}%`;
    if (trendValue < 0) return `-${Math.abs(trendValue).toFixed(1)}%`;
    return "0.0%";
  };

  return (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <div className="metric-header">
        <div className="metric-icon" style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
        <div className="metric-info">
          <div className="metric-label">{label}</div>
          <div className="metric-trend">
            <span className={`trend-value ${getTrendClass()}`}>
              {getTrendIcon()} {formatTrend(trend)}
            </span>
          </div>
        </div>
      </div>

      <div className="metric-value-container">
        <div className="metric-value" style={{ color: color }}>
          {value}
        </div>
        <div className="metric-unit">{unit}</div>
      </div>

      <div className="metric-description">{description}</div>

      <div className="metric-progress">
        <div
          className="progress-bar"
          style={{
            "--progress-color": color,
            "--progress-width": `${Math.min(Math.abs(trend) * 2, 100)}%`,
          }}
        >
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
