class SimulationService {
  constructor() {
    this.ws = null;
    this.state = null;
    this.listeners = new Set();
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 2000;
  }

  connect() {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.CONNECTING ||
        this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    try {
      this.ws = new WebSocket("ws://localhost:8000/ws");

      this.ws.onopen = () => {
        console.log("Connected to simulation server");
        this.connected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners("connected", true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.state = data;
          this.notifyListeners("state", data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.connected = false;
        this.notifyListeners("error", error);
      };

      this.ws.onclose = () => {
        console.log("Disconnected from simulation server");
        this.connected = false;
        this.notifyListeners("connected", false);

        // Attempt to reconnect
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.connected = false;
      this.notifyListeners("error", error);
      this.attemptReconnect();
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay =
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      if (!this.connected) {
        this.connect();
      }
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.reconnectAttempts = 0;
  }

  async addEmergencyVehicle(direction) {
    try {
      const response = await fetch(
        `http://localhost:8000/emergency/${direction}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to add emergency vehicle:", error);
      throw error;
    }
  }

  async updateConfig(config) {
    try {
      const params = new URLSearchParams();
      if (config.greenDuration)
        params.append("green_duration", config.greenDuration);
      if (config.vehicleRate) params.append("vehicle_rate", config.vehicleRate);

      const response = await fetch(
        `http://localhost:8000/config?${params.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update config:", error);
      throw error;
    }
  }

  async getState() {
    try {
      const response = await fetch("http://localhost:8000/state");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.state = data;
      return data;
    } catch (error) {
      console.error("Failed to get simulation state:", error);
      throw error;
    }
  }

  async controlSimulation(action) {
    try {
      const response = await fetch(
        `http://localhost:8000/control/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to control simulation:", error);
      throw error;
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(type, data);
      } catch (error) {
        console.error("Error in listener:", error);
      }
    });
  }

  getCurrentState() {
    return this.state;
  }

  isConnected() {
    return this.connected;
  }

  getConnectionStatus() {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }
}

// Create a singleton instance
const simulationService = new SimulationService();

export default simulationService;
