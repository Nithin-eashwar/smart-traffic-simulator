import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./EnvironmentalChart.css";

const EnvironmentalChart = ({ metricsHistory = [] }) => {
  // Prepare area chart data
  const areaChartData = useMemo(() => {
    if (!metricsHistory || metricsHistory.length === 0) {
      return Array.from({ length: 12 }, (_, i) => ({
        time: i * 5,
        co2Saved: Math.random() * 50 + 20,
        fuelSaved: Math.random() * 30 + 10,
        efficiency: Math.random() * 20 + 80,
      }));
    }

    return metricsHistory.slice(-12).map((metric, index) => ({
      time: index * 10,
      co2Saved: metric.co2_saved || 0,
      fuelSaved: metric.fuel_saved || 0,
      efficiency: Math.max(
        0,
        100 - (metric.congestion_level || 0) / 2 - (metric.avg_wait_time || 0)
      ),
    }));
  }, [metricsHistory]);

  // Prepare pie chart data for savings distribution
  const pieChartData = useMemo(() => {
    const latest = areaChartData[areaChartData.length - 1] || {};
    const totalSavings = latest.co2Saved + latest.fuelSaved;

    if (totalSavings === 0) {
      return [
        { name: "CO2 Savings", value: 50, color: "#1abc9c" },
        { name: "Fuel Savings", value: 50, color: "#f39c12" },
      ];
    }

    return [
      {
        name: "CO2 Savings",
        value: parseFloat(((latest.co2Saved / totalSavings) * 100).toFixed(1)),
        color: "#1abc9c",
      },
      {
        name: "Fuel Savings",
        value: parseFloat(((latest.fuelSaved / totalSavings) * 100).toFixed(1)),
        color: "#f39c12",
      },
    ];
  }, [areaChartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip environmental">
          <p className="tooltip-time">Time: {label} min</p>
          <div className="tooltip-grid">
            {payload.map((entry, index) => (
              <div key={index} className="tooltip-row">
                <div
                  className="tooltip-color"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="tooltip-label">{entry.name}:</span>
                <span className="tooltip-value">
                  {entry.dataKey === "efficiency"
                    ? `${entry.value.toFixed(1)}%`
                    : `${entry.value.toFixed(1)} ${
                        entry.dataKey === "co2Saved" ? "kg" : "L"
                      }`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="pie-tooltip">
          <p className="pie-tooltip-name">{data.name}</p>
          <p className="pie-tooltip-value">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  const totalSavings = useMemo(() => {
    const latest = areaChartData[areaChartData.length - 1] || {};
    return {
      co2: latest.co2Saved || 0,
      fuel: latest.fuelSaved || 0,
      total: (latest.co2Saved || 0) + (latest.fuelSaved || 0),
    };
  }, [areaChartData]);

  return (
    <div className="environmental-chart">
      <div className="chart-header">
        <h3>Environmental Impact</h3>
        <div className="savings-summary">
          <div className="savings-item co2">
            <div className="savings-icon">🌱</div>
            <div className="savings-info">
              <span className="savings-value">
                {totalSavings.co2.toFixed(1)} kg
              </span>
              <span className="savings-label">CO2 Saved</span>
            </div>
          </div>
          <div className="savings-item fuel">
            <div className="savings-icon">⛽</div>
            <div className="savings-info">
              <span className="savings-value">
                {totalSavings.fuel.toFixed(1)} L
              </span>
              <span className="savings-label">Fuel Saved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="area-chart-container">
          <h4>Savings Over Time</h4>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={areaChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <XAxis dataKey="time" stroke="#bdc3c7" tick={{ fontSize: 11 }} />
              <YAxis stroke="#bdc3c7" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="co2Saved"
                name="CO2 Saved (kg)"
                stackId="1"
                stroke="#1abc9c"
                fill="url(#colorCo2)"
                strokeWidth={2}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="fuelSaved"
                name="Fuel Saved (L)"
                stackId="1"
                stroke="#f39c12"
                fill="url(#colorFuel)"
                strokeWidth={2}
                fillOpacity={0.6}
              />
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1abc9c" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1abc9c" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f39c12" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f39c12" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart-container">
          <h4>Savings Distribution</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={60}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="impact-metrics">
        <div className="impact-item">
          <div className="impact-icon">🌍</div>
          <div className="impact-content">
            <div className="impact-value">
              Equivalent to {Math.round(totalSavings.co2 / 0.16)} trees
            </div>
            <div className="impact-label">Carbon Offset</div>
          </div>
        </div>
        <div className="impact-item">
          <div className="impact-icon">💰</div>
          <div className="impact-content">
            <div className="impact-value">
              ${(totalSavings.fuel * 1.5).toFixed(2)} saved
            </div>
            <div className="impact-label">Economic Benefit</div>
          </div>
        </div>
        <div className="impact-item">
          <div className="impact-icon">⏱️</div>
          <div className="impact-content">
            <div className="impact-value">
              {Math.round(totalSavings.total / 2)} min
            </div>
            <div className="impact-label">Reduced Idling</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalChart;
