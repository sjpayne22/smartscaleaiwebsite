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
  const [useFallback, setUseFallback] = useState(false);
  
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options;
  
  // Fallback function for static hosting without WebSocket support
  const fallbackSendMessage = useCallback(async (message: WebSocketMessage | string) => {
    try {
      // Parse the message if it's an object
      const messageData = typeof message === 'string' ? JSON.parse(message) : message;
      
      // Simple bot response logic for fallback mode
      let response: WebSocketMessage;
      
      if (messageData.type === 'chat') {
        // For chat messages, generate a simple response
        response = {
          type: 'chat',
          message: generateFallbackResponse(messageData.message),
          timestamp: new Date().toISOString(),
          sender: 'bot'
        };
      } else {
        // For other message types, return a generic response
        response = {
          type: 'info',
          message: 'This feature requires WebSocket support which is not available in static hosting mode.',
          timestamp: new Date().toISOString()
        };
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Process the response as if it came from the WebSocket
      setLastMessage(response);
      if (onMessage) onMessage(response);
      
      return true;
    } catch (error) {
      console.error('Error in fallback message handling:', error);
      return false;
    }
  }, [onMessage]);
  
  const connectWebSocket = useCallback(() => {
    // If we're already using fallback mode, don't try to connect
    if (useFallback) {
      setIsConnected(true);
      if (onConnect) onConnect();
      return;
    }
    
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
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          // Switch to fallback mode after max reconnect attempts
          console.log('Switching to fallback mode');
          setUseFallback(true);
          setIsConnected(true); // Simulate connected state in fallback mode
          if (onConnect) onConnect(); // Call onConnect to update UI
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      // Switch to fallback mode if connection fails immediately
      setUseFallback(true);
      setIsConnected(true); // Simulate connected state in fallback mode
      if (onConnect) onConnect(); // Call onConnect to update UI
    }
  }, [onConnect, onMessage, onDisconnect, onError, autoReconnect, reconnectInterval, maxReconnectAttempts, useFallback]);
  
  // Send a message through the WebSocket or fallback
  const sendMessage = useCallback((message: WebSocketMessage | string) => {
    // If in fallback mode, use the fallback handler
    if (useFallback) {
      return fallbackSendMessage(message);
    }
    
    // Otherwise try to use the WebSocket
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      // If WebSocket is not available, try fallback
      if (!isConnected) {
        return fallbackSendMessage(message);
      }
      return false;
    }
    
    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      socketRef.current.send(messageStr);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      // If sending fails, try fallback
      return fallbackSendMessage(message);
    }
  }, [isConnected, useFallback, fallbackSendMessage]);
  
  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (useFallback) {
      setIsConnected(false);
      if (onDisconnect) onDisconnect();
      return;
    }
    
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, [onDisconnect, useFallback]);
  
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
    disconnect,
    isFallbackMode: useFallback
  };
}

// Simple fallback response generator function
function generateFallbackResponse(message: string): string {
  message = message.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hi there! I'm Sparky. I'm in fallback mode right now, but I can still help with basic questions about SmartScale AI.";
  }
  
  if (message.includes('who are you') || message.includes('what are you')) {
    return "I'm Sparky, the SmartScale AI assistant. I'm currently running in fallback mode, which means I have limited functionality.";
  }
  
  if (message.includes('services') || message.includes('what do you do')) {
    return "SmartScale AI offers services including AI Strategy & Consulting, AI Implementation & Integration, Business Process Automation, Predictive Analytics, and AI Training.";
  }
  
  if (message.includes('contact') || message.includes('get in touch')) {
    return "You can contact SmartScale AI at info@smartscaleai.ai or call (386)473-2002. Our address is 3143 Autumnwood Trl, Apopka Florida 32703.";
  }
  
  if (message.includes('website') || message.includes('web')) {
    return "You're currently on the SmartScale AI website. Feel free to explore our services, insights, and more information about how we can help your business grow with AI.";
  }
  
  // Default response
  return "I'm currently in fallback mode with limited functionality. For more detailed information, please explore our website or contact us directly at info@smartscaleai.ai.";
}