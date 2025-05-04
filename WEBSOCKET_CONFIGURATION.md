# WebSocket Configuration Guide for SmartScale AI

This guide provides instructions for setting up and testing WebSockets for the SmartScale AI website.

## Server-Side WebSocket Setup

### 1. WebSocket Server Configuration

In `server/routes.ts`, the WebSocket server is set up on a distinct path to avoid conflicts with Vite's HMR websocket:

```typescript
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
```

### 2. Client Connection State Handling

When checking for ready state, use the `WebSocket.OPEN` constant rather than hardcoded numbers:

```typescript
// Import WebSocket (not as a type) to access constants
import { WebSocket } from 'ws';

// Example usage in message handler
wss.on('connection', (ws) => {
  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});
```

## Client-Side WebSocket Implementation

### 1. Dynamic Protocol Selection

Ensure the client dynamically selects the proper WebSocket protocol based on the page's security:

```typescript
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws`;
const socket = new WebSocket(wsUrl);
```

### 2. Event Handlers

Implement standard WebSocket event handlers:

```typescript
// Connection opened
socket.addEventListener('open', (event) => {
  console.log('Connected to WebSocket server');
  // You can send an initial message if needed
  socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Message from server:', message);
  
  // Process the message based on your application needs
  // For example, update UI, trigger notifications, etc.
});

// Connection closed
socket.addEventListener('close', (event) => {
  console.log('Disconnected from WebSocket server');
});

// Error handling
socket.addEventListener('error', (event) => {
  console.error('WebSocket error:', event);
});
```

## WebSocket Custom Hook (React)

Create a custom hook for WebSocket management in React components:

```typescript
// hooks/useWebSocket.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWebSocketProps {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export function useWebSocket({
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 5000,
  reconnectAttempts = 10
}: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  
  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.addEventListener('open', () => {
      setIsConnected(true);
      reconnectCountRef.current = 0;
      onOpen?.();
    });
    
    socket.addEventListener('message', (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        data = event.data;
      }
      onMessage?.(data);
    });
    
    socket.addEventListener('close', () => {
      setIsConnected(false);
      onClose?.();
      
      // Attempt to reconnect
      if (reconnectCountRef.current < reconnectAttempts) {
        setTimeout(() => {
          reconnectCountRef.current += 1;
          connect();
        }, reconnectInterval);
      }
    });
    
    socket.addEventListener('error', (error) => {
      onError?.(error);
    });
  }, [onMessage, onOpen, onClose, onError, reconnectInterval, reconnectAttempts]);
  
  const sendMessage = useCallback((data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      socketRef.current.send(message);
      return true;
    }
    return false;
  }, []);
  
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect: connect
  };
}
```

## Fallback Mechanism

Implement a fallback mechanism for clients where WebSockets aren't available:

```typescript
const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Try to use WebSockets if available
  useEffect(() => {
    let intervalId;
    try {
      // Check if WebSockets are supported
      if ('WebSocket' in window) {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
        
        socket.addEventListener('open', () => setIsConnected(true));
        socket.addEventListener('close', () => setIsConnected(false));
        socket.addEventListener('message', (event) => {
          setMessages(prev => [...prev, JSON.parse(event.data)]);
        });
        
        return () => socket.close();
      } else {
        // Fallback to polling if WebSockets aren't available
        console.log('WebSockets not supported, falling back to polling');
        intervalId = setInterval(() => {
          fetch('/api/messages')
            .then(res => res.json())
            .then(data => setMessages(data));
        }, 3000);
      }
    } catch (err) {
      console.error('Error establishing WebSocket connection:', err);
      // Fallback to polling
      intervalId = setInterval(() => {
        fetch('/api/messages')
          .then(res => res.json())
          .then(data => setMessages(data));
      }, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  
  return { messages, isConnected };
};
```

## Testing WebSocket Connection

Create a simple HTML test file (`test-websocket.html`) for testing:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSocket Test</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    #messages { border: 1px solid #ccc; height: 300px; overflow-y: auto; margin-bottom: 10px; padding: 10px; }
    #status { font-weight: bold; }
    input[type="text"] { width: 70%; padding: 8px; }
    button { padding: 8px 16px; background: #0066cc; color: white; border: none; cursor: pointer; }
  </style>
</head>
<body>
  <h1>SmartScale AI WebSocket Test</h1>
  <p>Status: <span id="status">Disconnected</span></p>
  <div id="messages"></div>
  <form id="messageForm">
    <input type="text" id="messageInput" placeholder="Type a message..." />
    <button type="submit">Send</button>
  </form>
  <button id="connectBtn">Connect</button>
  <button id="disconnectBtn" disabled>Disconnect</button>

  <script>
    const statusEl = document.getElementById('status');
    const messagesEl = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const messageForm = document.getElementById('messageForm');
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    
    let socket = null;
    
    function connect() {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        socket = new WebSocket(wsUrl);
        
        statusEl.textContent = 'Connecting...';
        appendMessage('System', 'Connecting to WebSocket server...');
        
        socket.addEventListener('open', () => {
          statusEl.textContent = 'Connected';
          statusEl.style.color = 'green';
          connectBtn.disabled = true;
          disconnectBtn.disabled = false;
          appendMessage('System', 'Connected to server');
        });
        
        socket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          appendMessage(data.sender || 'Server', data.message || data);
        });
        
        socket.addEventListener('close', () => {
          statusEl.textContent = 'Disconnected';
          statusEl.style.color = 'red';
          connectBtn.disabled = false;
          disconnectBtn.disabled = true;
          appendMessage('System', 'Disconnected from server');
          socket = null;
        });
        
        socket.addEventListener('error', (error) => {
          statusEl.textContent = 'Error';
          statusEl.style.color = 'red';
          appendMessage('System', `WebSocket error: ${error}`);
        });
      } catch (err) {
        statusEl.textContent = 'Error';
        statusEl.style.color = 'red';
        appendMessage('System', `Failed to connect: ${err.message}`);
      }
    }
    
    function disconnect() {
      if (socket) {
        socket.close();
      }
    }
    
    function appendMessage(sender, message) {
      const messageEl = document.createElement('div');
      const time = new Date().toLocaleTimeString();
      messageEl.innerHTML = `<strong>${time} - ${sender}:</strong> ${message}`;
      messagesEl.appendChild(messageEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        appendMessage('System', 'Not connected to server');
        return;
      }
      
      const message = messageInput.value.trim();
      if (message) {
        const data = JSON.stringify({
          message,
          sender: 'Client',
          timestamp: new Date().toISOString()
        });
        socket.send(data);
        appendMessage('You', message);
        messageInput.value = '';
      }
    });
    
    connectBtn.addEventListener('click', connect);
    disconnectBtn.addEventListener('click', disconnect);
    
    // Auto-connect when the page loads
    window.addEventListener('load', connect);
  </script>
</body>
</html>
```

## Troubleshooting WebSockets

### Common Issues

1. **Connection Refused**
   - Check that the server is running
   - Verify the WebSocket path is correct
   - Ensure no firewall is blocking the connection

2. **CORS Issues**
   - WebSocket connections are subject to CORS policy
   - Ensure the server accepts connections from the client's origin

3. **SSL Mixed Content**
   - If your site is on HTTPS, WebSocket must use WSS protocol
   - Check that protocol selection is dynamic

4. **Proxy Configuration**
   - If using a reverse proxy, ensure it's configured to pass WebSocket connections
   - For Nginx, add:
     ```
     location /ws {
       proxy_pass http://backend_server;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
     }
     ```

### Testing Tools

- Use the included test-websocket.html page
- Chrome/Firefox DevTools Network tab (filter by WS)
- WebSocket client extensions for browsers

## Performance Considerations

- Limit message size for efficiency
- Implement heartbeat mechanisms for long-lived connections
- Consider binary message format for large data
- Add reconnection logic with exponential backoff
