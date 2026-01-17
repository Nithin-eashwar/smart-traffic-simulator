import { useState, useEffect, useCallback } from "react";
import simulationService from "../services/simulationService";

export const useSimulation = () => {
  const [simulationState, setSimulationState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to simulation service
    simulationService.connect();

    // Subscribe to state updates
    const unsubscribe = simulationService.subscribe((type, data) => {
      switch (type) {
        case "connected":
          setIsConnected(data);
          if (data) {
            setError(null);
          }
          break;
        case "state":
          setSimulationState(data);
          setLoading(false);
          break;
        case "error":
          setError(data.message || "Unknown error");
          setLoading(false);
          break;
      }
    });

    // Fetch initial state
    const fetchInitialState = async () => {
      try {
        const state = await simulationService.getState();
        setSimulationState(state);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch initial state");
        setLoading(false);
      }
    };

    fetchInitialState();

    // Cleanup
    return () => {
      unsubscribe();
      simulationService.disconnect();
    };
  }, []);

  const addEmergencyVehicle = useCallback(async (direction) => {
    try {
      setLoading(true);
      const result = await simulationService.addEmergencyVehicle(direction);

      if (!result.success) {
        throw new Error(result.message || "Failed to add emergency vehicle");
      }

      return result;
    } catch (err) {
      setError(err.message || "Failed to add emergency vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (config) => {
    try {
      setLoading(true);
      const result = await simulationService.updateConfig(config);

      if (!result.success) {
        throw new Error("Failed to update configuration");
      }

      return result;
    } catch (err) {
      setError(err.message || "Failed to update configuration");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const reconnect = useCallback(() => {
    setLoading(true);
    setError(null);
    simulationService.connect();
  }, []);

  return {
    // State
    simulationState,
    isConnected,
    loading,
    error,

    // Actions
    addEmergencyVehicle,
    updateConfig,
    resetError,
    reconnect,

    // Helper functions
    getRoadState: useCallback(
      (direction) => {
        if (!simulationState?.roads) return null;
        return simulationState.roads[direction];
      },
      [simulationState]
    ),

    getCurrentGreenDirection: useCallback(() => {
      return simulationState?.current_green || null;
    }, [simulationState]),

    getMetrics: useCallback(() => {
      return simulationState?.metrics || {};
    }, [simulationState]),

    getSimulationTime: useCallback(() => {
      return simulationState?.simulation_time || 0;
    }, [simulationState]),
  };
};
