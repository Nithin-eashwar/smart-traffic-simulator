import { useState, useEffect, useMemo, useCallback } from "react";

export const useMetrics = (metrics = {}) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [maxHistoryLength] = useState(100);

  // Update historical data when metrics change
  useEffect(() => {
    if (Object.keys(metrics).length > 0) {
      const timestamp = Date.now();
      const newDataPoint = {
        timestamp,
        ...metrics,
      };

      setHistoricalData((prev) => {
        const updated = [...prev, newDataPoint];
        // Keep only the last N data points
        if (updated.length > maxHistoryLength) {
          return updated.slice(-maxHistoryLength);
        }
        return updated;
      });
    }
  }, [metrics, maxHistoryLength]);

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    if (historicalData.length === 0) return {};

    const latest = historicalData[historicalData.length - 1];
    const avgWaitTime = latest.avg_wait_time || 0;
    const congestionLevel = latest.congestion_level || 0;
    const throughput = latest.throughput || 0;
    const emergencyVehicles = latest.emergency_vehicles || 0;

    // Calculate trends (compared to average of last 10 data points)
    const recentData = historicalData.slice(-10);
    const avgRecentWaitTime =
      recentData.reduce((sum, data) => sum + (data.avg_wait_time || 0), 0) /
      recentData.length;
    const avgRecentCongestion =
      recentData.reduce((sum, data) => sum + (data.congestion_level || 0), 0) /
      recentData.length;

    const waitTimeTrend =
      avgRecentWaitTime > 0
        ? ((avgWaitTime - avgRecentWaitTime) / avgRecentWaitTime) * 100
        : 0;

    const congestionTrend =
      avgRecentCongestion > 0
        ? ((congestionLevel - avgRecentCongestion) / avgRecentCongestion) * 100
        : 0;

    return {
      avgWaitTime,
      congestionLevel,
      throughput,
      emergencyVehicles,
      waitTimeTrend,
      congestionTrend,
      efficiency: Math.max(0, 100 - congestionLevel - waitTimeTrend),
      systemHealth: 100 - congestionLevel / 2 - Math.max(0, waitTimeTrend) / 2,
      co2Saved: latest.co2_saved || 0,
      fuelSaved: latest.fuel_saved || 0,
      vehiclesProcessed: latest.vehicles_processed || 0,
      signalChanges: latest.signal_changes || 0,
    };
  }, [historicalData]);

  // Generate alerts based on metrics
  useEffect(() => {
    const newAlerts = [];
    const timestamp = Date.now();

    // Check for congestion alerts
    if (derivedMetrics.congestionLevel >= 80) {
      newAlerts.push({
        id: `congestion-${timestamp}`,
        type: "critical",
        title: "High Congestion Alert",
        message: `Traffic congestion at ${derivedMetrics.congestionLevel.toFixed(
          1
        )}%`,
        timestamp,
        priority: 1,
      });
    } else if (derivedMetrics.congestionLevel >= 60) {
      newAlerts.push({
        id: `congestion-${timestamp}`,
        type: "warning",
        title: "Moderate Congestion",
        message: `Traffic congestion at ${derivedMetrics.congestionLevel.toFixed(
          1
        )}%`,
        timestamp,
        priority: 2,
      });
    }

    // Check for wait time alerts
    if (derivedMetrics.avgWaitTime > 10) {
      newAlerts.push({
        id: `wait-time-${timestamp}`,
        type: "critical",
        title: "High Wait Time",
        message: `Average wait time: ${derivedMetrics.avgWaitTime.toFixed(
          1
        )} minutes`,
        timestamp,
        priority: 1,
      });
    } else if (derivedMetrics.avgWaitTime > 5) {
      newAlerts.push({
        id: `wait-time-${timestamp}`,
        type: "warning",
        title: "Elevated Wait Time",
        message: `Average wait time: ${derivedMetrics.avgWaitTime.toFixed(
          1
        )} minutes`,
        timestamp,
        priority: 2,
      });
    }

    // Check for emergency vehicle activity
    if (derivedMetrics.emergencyVehicles > 0) {
      newAlerts.push({
        id: `emergency-${timestamp}`,
        type: "info",
        title: "Emergency Vehicle Active",
        message: `${derivedMetrics.emergencyVehicles} emergency vehicle(s) in the system`,
        timestamp,
        priority: 3,
      });
    }

    // Check for positive trends
    if (derivedMetrics.waitTimeTrend < -10) {
      newAlerts.push({
        id: `improvement-${timestamp}`,
        type: "success",
        title: "Wait Time Improving",
        message: `Wait time decreased by ${Math.abs(
          derivedMetrics.waitTimeTrend
        ).toFixed(1)}%`,
        timestamp,
        priority: 4,
      });
    }

    // Update alerts, remove old ones (older than 5 minutes)
    setAlerts((prev) => {
      const fiveMinutesAgo = timestamp - 5 * 60 * 1000;
      const filteredAlerts = prev.filter(
        (alert) => alert.timestamp > fiveMinutesAgo
      );
      return [...filteredAlerts, ...newAlerts].sort(
        (a, b) => a.priority - b.priority
      );
    });
  }, [derivedMetrics]);

  // Get chart data for specific metric
  const getChartData = useCallback(
    (metricKey, dataPoints = 20) => {
      if (historicalData.length === 0) return [];

      const slicedData = historicalData.slice(-dataPoints);
      return slicedData.map((data, index) => ({
        time: index,
        value: data[metricKey] || 0,
        timestamp: data.timestamp,
      }));
    },
    [historicalData]
  );

  // Get metrics summary for display
  const getMetricsSummary = useCallback(() => {
    return {
      current: derivedMetrics,
      historical: historicalData,
      trends: {
        waitTime: derivedMetrics.waitTimeTrend,
        congestion: derivedMetrics.congestionTrend,
        efficiency: derivedMetrics.efficiency,
      },
      alerts: alerts.slice(0, 5), // Latest 5 alerts
      statistics: {
        dataPoints: historicalData.length,
        timeRange:
          historicalData.length > 0
            ? historicalData[historicalData.length - 1].timestamp -
              historicalData[0].timestamp
            : 0,
      },
    };
  }, [derivedMetrics, historicalData, alerts]);

  // Clear specific alert
  const clearAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    // Current metrics
    currentMetrics: derivedMetrics,

    // Historical data
    historicalData,

    // Alerts
    alerts,
    clearAlert,
    clearAllAlerts,

    // Data access methods
    getChartData,
    getMetricsSummary,

    // Helper methods
    getMetricHistory: useCallback(
      (metricKey) => {
        return historicalData.map((data) => ({
          timestamp: data.timestamp,
          value: data[metricKey] || 0,
        }));
      },
      [historicalData]
    ),

    // Check specific conditions
    isCongested: derivedMetrics.congestionLevel >= 60,
    isHeavilyCongested: derivedMetrics.congestionLevel >= 80,
    isWaitTimeHigh: derivedMetrics.avgWaitTime > 5,
    isEmergencyActive: derivedMetrics.emergencyVehicles > 0,
    isImproving: derivedMetrics.waitTimeTrend < 0,

    // Performance indicators
    efficiencyScore: derivedMetrics.efficiency,
    systemHealthScore: derivedMetrics.systemHealth,
  };
};
