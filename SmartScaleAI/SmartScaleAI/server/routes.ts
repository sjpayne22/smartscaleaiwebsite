import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Function to generate bot responses with enhanced NLP capabilities
function generateBotResponse(userMessage: string): string {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Basic categories for response
  const responseCategories = {
    greeting: [
      "Hello! Welcome to SmartScale AI's live chat service. How can I assist you today?",
      "Hi there! I'm Sparky, the Smart AI assistant. How can I help with your AI needs?",
      "Greetings from SmartScale AI! I'm here to answer your questions and connect you with our team."
    ],
    services: [
      "At SmartScale AI, we offer a range of services including AI Strategy & Consulting, Implementation & Integration, Business Process Automation, Predictive Analytics, and AI Training. Which area interests you most?",
      "Our services are designed to help businesses of all sizes leverage AI effectively. We can help with everything from strategy development to implementation and training. Would you like more details about a specific service?",
      "SmartScale AI specializes in making AI accessible and practical for small and mid-sized businesses. Our services include customized AI solutions, predictive analytics, and strategic consulting. Which aspect would you like to explore further?"
    ],
    pricing: [
      "Our pricing is tailored to your specific needs and project scope. I'd be happy to connect you with our team who can provide a customized quote. Would you like someone to contact you?",
      "SmartScale AI offers flexible pricing models designed to fit businesses of various sizes. For accurate pricing information, our team would need to understand your specific requirements. Would you like to schedule a consultation?",
      "We believe in transparent and value-based pricing. While each project is unique, we work within your budget constraints to deliver maximum value. Can I connect you with our sales team for a personalized discussion?"
    ],
    contact: [
      "You can reach our team at info@smartscaleai.ai or call us at (386)473-2002. Alternatively, I can take your information and have someone from our team contact you directly. Would that be helpful?",
      "The best way to get in touch is through our contact form on this website, or by emailing info@smartscaleai.ai. Would you like me to direct you to the contact section?",
      "Our team is available at (386)473-2002 or via email at info@smartscaleai.ai. You can also schedule a consultation directly through our website. How would you prefer to connect?"
    ],
    default: [
      "That's an interesting question! SmartScale AI specializes in making artificial intelligence accessible and practical for businesses like yours. Would you like to know more about how we can help with your specific needs?",
      "Thanks for reaching out! Our team of AI experts would be happy to discuss this in more detail. Would you like me to arrange a consultation call with one of our specialists?",
      "Great question! At SmartScale AI, we focus on delivering tailored AI solutions that address your unique business challenges. Can you tell me more about what you're looking for so I can provide more specific information?"
    ]
  };
  
  // Enhanced pattern matching
  if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hey") || lowerCaseMessage.match(/^(good\s*morning|good\s*afternoon|good\s*evening)/)) {
    return getRandomResponse(responseCategories.greeting);
  } else if (lowerCaseMessage.includes("service") || lowerCaseMessage.includes("offer") || lowerCaseMessage.includes("provide") || lowerCaseMessage.includes("solution") || lowerCaseMessage.includes("what do you do")) {
    return getRandomResponse(responseCategories.services);
  } else if (lowerCaseMessage.includes("price") || lowerCaseMessage.includes("cost") || lowerCaseMessage.includes("much") || lowerCaseMessage.includes("fee") || lowerCaseMessage.includes("budget")) {
    return getRandomResponse(responseCategories.pricing);
  } else if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("email") || lowerCaseMessage.includes("phone") || lowerCaseMessage.includes("call") || lowerCaseMessage.includes("reach") || lowerCaseMessage.includes("talk to")) {
    return getRandomResponse(responseCategories.contact);
  } else {
    return getRandomResponse(responseCategories.default);
  }
}

// Helper function to get a random response from a category
function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const contactData = insertContactSchema.parse(req.body);
      
      // Store the contact submission
      const submission = await storage.createContactSubmission(contactData);

      // Send response immediately after successful submission
      res.status(201).json({
        message: "Thank you for your message! We'll get back to you soon.",
        id: submission.id
      });
      
      // On production: Send email notification
      // For production implementation, you would integrate with a mail service 
      // such as Nodemailer, SendGrid, or AWS SES to send emails.
      // This example code demonstrates what would happen in production:
      console.log(`[Contact Form] Sending email to info@smartscaleai.ai`);
      console.log(`[Contact Form] From: ${contactData.name} <${contactData.email}>`);
      console.log(`[Contact Form] Company: ${contactData.company || 'Not provided'}`);
      console.log(`[Contact Form] Phone: ${contactData.phone || 'Not provided'}`);
      console.log(`[Contact Form] Message: ${contactData.message}`);
      
      // Example email that would be sent:
      const emailTemplate = `
        New Contact Form Submission
        --------------------------
        Name: ${contactData.name}
        Email: ${contactData.email}
        Company: ${contactData.company || 'Not provided'}
        Phone: ${contactData.phone || 'Not provided'}
        
        Message:
        ${contactData.message}
        
        This submission was received on ${new Date().toLocaleString()}.
      `;
      console.log(`[Contact Form] Email Template: ${emailTemplate}`);
      
      // Return success response
      return res.status(201).json({
        message: "Thank you for your message! We'll get back to you soon.",
        id: submission.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      console.error("Error handling contact submission:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server on a distinct path to avoid conflict with Vite's HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    // Send welcome message to the client
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to SmartScale AI WebSocket server'
    }));
    
    // Handle messages from clients
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
        
        // Process message based on its type
        switch (data.type) {
          case 'chat':
            // Broadcast user message to all connected clients
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
            
            // If message is from a user, simulate AI response using enhanced NLP
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
            break;
            
          case 'notification':
            // Handle notification messages
            ws.send(JSON.stringify({
              type: 'notification',
              message: 'Notification received',
              data: data
            }));
            break;
            
          default:
            // Echo unknown message types back to sender
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type',
              originalData: data
            }));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Error processing your message'
        }));
      }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
