import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./WaitTimeChart.css";

const WaitTimeChart = ({ metricsHistory = [] }) => {
  // Prepare chart data from history
  const chartData = useMemo(() => {
    if (!metricsHistory || metricsHistory.length === 0) {
      // Generate sample data if no history
      return Array.from({ length: 10 }, (_, i) => ({
        time: i * 10,
        avgWaitTime: Math.random() * 15 + 5,
        maxWaitTime: Math.random() * 25 + 10,
        vehiclesProcessed: Math.floor(Math.random() * 50) + 10,
      }));
    }

    return metricsHistory.slice(-20).map((metric, index) => ({
      time: index * 5, // 5-minute intervals
      avgWaitTime: metric.avg_wait_time || 0,
      maxWaitTime: metric.max_wait_time || 0,
      vehiclesProcessed: metric.vehicles_processed || 0,
    }));
  }, [metricsHistory]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">Time: {label} min</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="tooltip-item"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toFixed(1)}{" "}
              {entry.dataKey === "vehiclesProcessed" ? "vehicles" : "min"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="wait-time-chart">
      <div className="chart-header">
        <h3>Wait Time Analysis</h3>
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Current Avg:</span>
            <span className="stat-value">
              {chartData[chartData.length - 1]?.avgWaitTime?.toFixed(1) ||
                "0.0"}{" "}
              min
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Peak:</span>
            <span className="stat-value">
              {Math.max(...chartData.map((d) => d.maxWaitTime)).toFixed(1)} min
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="time"
            stroke="#bdc3c7"
            label={{
              value: "Time (minutes)",
              position: "insideBottom",
              offset: -5,
              fill: "#7f8c8d",
            }}
          />
          <YAxis
            yAxisId="left"
            stroke="#bdc3c7"
            label={{
              value: "Wait Time (min)",
              angle: -90,
              position: "insideLeft",
              offset: -10,
              fill: "#7f8c8d",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#2ecc71"
            label={{
              value: "Vehicles",
              angle: 90,
              position: "insideRight",
              offset: -10,
              fill: "#7f8c8d",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgWaitTime"
            name="Average Wait Time"
            stroke="#3498db"
            strokeWidth={2}
            dot={{ stroke: "#3498db", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, stroke: "#3498db", strokeWidth: 2 }}
            yAxisId="left"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="maxWaitTime"
            name="Maximum Wait Time"
            stroke="#e74c3c"
            strokeWidth={2}
            dot={{ stroke: "#e74c3c", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, stroke: "#e74c3c", strokeWidth: 2 }}
            strokeDasharray="5 5"
            yAxisId="left"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="vehiclesProcessed"
            name="Vehicles Processed"
            stroke="#2ecc71"
            strokeWidth={2}
            dot={{ stroke: "#2ecc71", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, stroke: "#2ecc71", strokeWidth: 2 }}
            yAxisId="right"
            isAnimationActive={true}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <div className="trend-indicator">
          <div className="trend-icon">📈</div>
          <div className="trend-info">
            <span className="trend-label">Trend:</span>
            <span className="trend-value positive">↓ 12% from peak</span>
          </div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#3498db" }}
            ></div>
            <span>Average Wait</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#e74c3c" }}
            ></div>
            <span>Maximum Wait</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#2ecc71" }}
            ></div>
            <span>Throughput</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitTimeChart;
