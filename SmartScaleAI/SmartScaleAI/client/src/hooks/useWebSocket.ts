import { useState, useEffect, useRef, useCallback } from 'react';

// Define message types
export interface WebSocketMessage {
  type: string;
  message: string;
  [key: string]: any; // Allow additional properties
}

export interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options;
  
  const connectWebSocket = useCallback(() => {
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        if (onConnect) onConnect();
      };
      
      socket.onmessage = (event) => {
        try {
          const parsedMessage = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(parsedMessage);
          if (onMessage) onMessage(parsedMessage);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        if (onDisconnect) onDisconnect();
        
        // Attempt to reconnect if auto-reconnect is enabled
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, reconnectInterval);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [onConnect, onMessage, onDisconnect, onError, autoReconnect, reconnectInterval, maxReconnectAttempts]);
  
  // Send a message through the WebSocket
  const sendMessage = useCallback((message: WebSocketMessage | string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return false;
    }
    
    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      socketRef.current.send(messageStr);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }, []);
  
  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);
  
  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      disconnect();
    };
  }, [connectWebSocket, disconnect]);
  
  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect: connectWebSocket,
    disconnect
  };
}