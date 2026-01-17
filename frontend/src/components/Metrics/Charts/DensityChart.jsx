import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./DensityChart.css";

const DensityChart = ({ roads = {} }) => {
  // Prepare data for density chart
  const chartData = useMemo(() => {
    const roadConfigs = [
      { angle: 0, name: "NORTH", color: "#3498db" },
      { angle: 45, name: "NORTHEAST", color: "#2ecc71" },
      { angle: 90, name: "EAST", color: "#e74c3c" },
      { angle: 135, name: "SOUTHEAST", color: "#9b59b6" },
      { angle: 180, name: "SOUTH", color: "#1abc9c" },
      { angle: 225, name: "SOUTHWEST", color: "#f39c12" },
      { angle: 270, name: "WEST", color: "#34495e" },
      { angle: 315, name: "NORTHWEST", color: "#7f8c8d" },
    ];

    return roadConfigs.map((config) => {
      const road = roads[config.angle];
      const density = road?.density || 0;
      const vehicleCount = road?.vehicle_count || 0;

      let congestionLevel = "Low";
      if (density >= 80) congestionLevel = "Critical";
      else if (density >= 60) congestionLevel = "High";
      else if (density >= 40) congestionLevel = "Medium";

      return {
        name: config.name,
        density: parseFloat(density.toFixed(1)),
        vehicles: vehicleCount,
        congestionLevel,
        color: config.color,
      };
    });
  }, [roads]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip density">
          <p className="tooltip-road">{data.name} Road</p>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">Density:</span>
              <span className="tooltip-value" style={{ color: data.color }}>
                {data.density}%
              </span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Vehicles:</span>
              <span className="tooltip-value">{data.vehicles}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Status:</span>
              <span
                className={`tooltip-value status ${data.congestionLevel.toLowerCase()}`}
              >
                {data.congestionLevel}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (density) => {
    if (density >= 80) return "#e74c3c";
    if (density >= 60) return "#f39c12";
    if (density >= 40) return "#f1c40f";
    return "#2ecc71";
  };

  // Calculate overall congestion
  const overallCongestion = useMemo(() => {
    const totalDensity = chartData.reduce((sum, road) => sum + road.density, 0);
    return (totalDensity / chartData.length).toFixed(1);
  }, [chartData]);

  return (
    <div className="density-chart">
      <div className="chart-header">
        <h3>Road Density Analysis</h3>
        <div className="congestion-summary">
          <div className="summary-item">
            <span className="summary-label">Overall Density:</span>
            <span className="summary-value">{overallCongestion}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Status:</span>
            <span
              className={`summary-status ${
                overallCongestion >= 60
                  ? "critical"
                  : overallCongestion >= 40
                  ? "moderate"
                  : "good"
              }`}
            >
              {overallCongestion >= 60
                ? "High"
                : overallCongestion >= 40
                ? "Moderate"
                : "Good"}
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
            vertical={false}
          />
          <XAxis dataKey="name" stroke="#bdc3c7" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#bdc3c7"
            label={{
              value: "Density (%)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fill: "#7f8c8d",
            }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="density"
            name="Traffic Density"
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={500}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.density)}
                stroke={entry.color}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <div className="density-breakdown">
          <h4>Density Levels:</h4>
          <div className="breakdown-grid">
            <div className="breakdown-item good">
              <div className="breakdown-color"></div>
              <div className="breakdown-info">
                <span className="breakdown-range">0-40%</span>
                <span className="breakdown-label">Good</span>
              </div>
            </div>
            <div className="breakdown-item moderate">
              <div className="breakdown-color"></div>
              <div className="breakdown-info">
                <span className="breakdown-range">40-60%</span>
                <span className="breakdown-label">Moderate</span>
              </div>
            </div>
            <div className="breakdown-item high">
              <div className="breakdown-color"></div>
              <div className="breakdown-info">
                <span className="breakdown-range">60-80%</span>
                <span className="breakdown-label">High</span>
              </div>
            </div>
            <div className="breakdown-item critical">
              <div className="breakdown-color"></div>
              <div className="breakdown-info">
                <span className="breakdown-range">80-100%</span>
                <span className="breakdown-label">Critical</span>
              </div>
            </div>
          </div>
        </div>

        <div className="road-highlights">
          <h4>Most Congested:</h4>
          {[...chartData]
            .sort((a, b) => b.density - a.density)
            .slice(0, 2)
            .map((road, index) => (
              <div key={index} className="highlight-item">
                <div
                  className="highlight-color"
                  style={{ backgroundColor: road.color }}
                ></div>
                <span className="highlight-road">{road.name}</span>
                <span className="highlight-density">{road.density}%</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DensityChart;
