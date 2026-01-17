import { useState, useEffect, useCallback } from "react";
import websocketService from "../services/websocketService";

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    if (!url) return;

    // Connect to WebSocket
    websocketService.connect(url);

    // Subscribe to connection events
    const unsubscribeConnection = websocketService.onConnection((connected) => {
      setIsConnected(connected);
      setConnectionStatus(connected ? "connected" : "disconnected");
      if (!connected) {
        setError("Disconnected from server");
      } else {
        setError(null);
      }
    });

    // Subscribe to error events
    const unsubscribeError = websocketService.onError((err) => {
      setError(err.message || "WebSocket error");
      setConnectionStatus("error");
    });

    // Subscribe to all messages
    const unsubscribeMessage = websocketService.subscribe("message", (data) => {
      setLastMessage(data);
    });

    // Get initial connection status
    setConnectionStatus(websocketService.getConnectionStatus());
    setIsConnected(websocketService.isConnected());

    // Cleanup
    return () => {
      unsubscribeConnection();
      unsubscribeError();
      unsubscribeMessage();
      websocketService.disconnect();
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    return websocketService.send(message);
  }, []);

  const reconnect = useCallback(() => {
    setError(null);
    if (url) {
      websocketService.connect(url);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionStatus("disconnected");
  }, []);

  const subscribe = useCallback((eventType, handler) => {
    return websocketService.subscribe(eventType, handler);
  }, []);

  const onConnectionChange = useCallback((handler) => {
    return websocketService.onConnection(handler);
  }, []);

  return {
    // State
    isConnected,
    lastMessage,
    error,
    connectionStatus,

    // Actions
    sendMessage,
    reconnect,
    disconnect,
    subscribe,
    onConnectionChange,

    // Helper methods
    sendJSON: useCallback(
      (data) => {
        return sendMessage(JSON.stringify(data));
      },
      [sendMessage]
    ),

    clearError: useCallback(() => {
      setError(null);
    }, []),
  };
};
