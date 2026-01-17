class WebSocketService {
  constructor() {
    this.ws = null;
    this.messageHandlers = new Map();
    this.connectionHandlers = new Set();
    this.errorHandlers = new Set();
    this.reconnectInterval = null;
    this.reconnectDelay = 2000;
    this.maxReconnectAttempts = 10;
    this.reconnectAttempts = 0;
    this.connectionUrl = null;
  }

  connect(url) {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.CONNECTING ||
        this.ws.readyState === WebSocket.OPEN)
    ) {
      console.log("WebSocket already connecting or connected");
      return;
    }

    this.connectionUrl = url;

    try {
      this.ws = new WebSocket(url);
      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.handleError(error);
      this.scheduleReconnect();
    }
  }

  setupEventListeners() {
    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);

      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
        this.handleError(error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.handleError(error);
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      this.notifyConnectionHandlers(false);

      if (!this.isNormalClosure(event.code)) {
        this.scheduleReconnect();
      }
    };
  }

  isNormalClosure(code) {
    return code === 1000 || code === 1001;
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }

    this.reconnectAttempts++;
    const delay =
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);

    console.log(
      `Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.reconnectInterval = setTimeout(() => {
      if (this.ws?.readyState === WebSocket.CLOSED) {
        this.connect(this.connectionUrl);
      }
    }, delay);
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const messageStr =
          typeof message === "string" ? message : JSON.stringify(message);
        this.ws.send(messageStr);
        return true;
      } catch (error) {
        console.error("Failed to send WebSocket message:", error);
        this.handleError(error);
        return false;
      }
    } else {
      console.warn("WebSocket not connected, cannot send message");
      return false;
    }
  }

  subscribe(eventType, handler) {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, new Set());
    }
    this.messageHandlers.get(eventType).add(handler);

    return () => {
      const handlers = this.messageHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(eventType);
        }
      }
    };
  }

  onConnection(handler) {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  onError(handler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  handleMessage(data) {
    const { type, ...payload } = data;

    if (type && this.messageHandlers.has(type)) {
      this.messageHandlers.get(type).forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error("Error in message handler:", error);
        }
      });
    }

    // Also trigger 'message' handlers for all messages
    if (this.messageHandlers.has("message")) {
      this.messageHandlers.get("message").forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error("Error in message handler:", error);
        }
      });
    }
  }

  handleError(error) {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error("Error in error handler:", handlerError);
      }
    });
  }

  notifyConnectionHandlers(connected) {
    this.connectionHandlers.forEach((handler) => {
      try {
        handler(connected);
      } catch (error) {
        console.error("Error in connection handler:", error);
      }
    });
  }

  disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Normal closure");
      this.ws = null;
    }

    this.reconnectAttempts = 0;
    this.messageHandlers.clear();
    this.connectionHandlers.clear();
    this.errorHandlers.clear();
  }

  getConnectionStatus() {
    if (!this.ws) {
      return "disconnected";
    }

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "unknown";
    }
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
