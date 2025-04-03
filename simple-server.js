const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Create a WebSocket server
const wss = new WebSocket.Server({ server, path: '/ws' });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send a welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to WebSocket server'
  }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data);
      
      // Process the message
      if (data.type === 'chat') {
        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'chat',
              sender: data.sender,
              message: data.message,
              timestamp: new Date().toISOString()
            }));
          }
        });
        
        // If message is from a user, generate a bot response
        if (data.sender === 'user') {
          setTimeout(() => {
            const botResponse = generateBotResponse(data.message);
            
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat',
                  sender: 'bot',
                  message: botResponse,
                  timestamp: new Date().toISOString()
                }));
              }
            });
          }, 1500); // Simulate thinking time
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Error processing your message'
      }));
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to generate bot responses
function generateBotResponse(message) {
  const userMessage = message.toLowerCase();
  
  if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
    return "Hello! I'm Sparky from SmartScale AI. How can I help you today?";
  }
  
  if (userMessage.includes('services') || userMessage.includes('what do you do')) {
    return "SmartScale AI offers services including AI Strategy & Consulting, AI Implementation & Integration, Business Process Automation, Predictive Analytics, and AI Training.";
  }
  
  if (userMessage.includes('contact') || userMessage.includes('reach you')) {
    return "You can contact SmartScale AI at info@smartscaleai.ai or call (386)473-2002.";
  }
  
  // Default response
  return "Thanks for your message! SmartScale AI is dedicated to helping businesses leverage AI technology for growth. Is there anything specific you'd like to know about our services?";
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});