import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, Bot, Sparkles, Save, Settings, PlusCircle, Trash, Wifi, WifiOff } from "lucide-react";
import { Button } from "./button";
import { GradientText } from "./gradient-text";
import { cn } from "@/lib/utils";
import { useWebSocket, WebSocketMessage } from "@/hooks/useWebSocket";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface TrainingEntry {
  pattern: string;
  response: string;
  category: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi there! I'm Sparky, your friendly AI assistant. How can I help you learn about SmartScale AI solutions today?",
    sender: "bot",
    timestamp: new Date()
  }
];

// Base bot responses
const defaultBotResponses: { [key: string]: string[] } = {
  default: [
    "That's an interesting question! SmartScale AI specializes in making AI accessible for small and mid-sized businesses. Would you like to know more about a specific service?",
    "Thanks for reaching out! Our team would be happy to discuss this in more detail. Would you like me to arrange a consultation call?",
    "Great question! SmartScale AI offers custom AI solutions tailored to your business needs. Can you tell me more about what you're looking for?"
  ],
  greeting: [
    "Hello! How can I assist you with AI solutions today?",
    "Hi there! I'm Sparky, SmartScale's AI assistant. What can I help you with?",
    "Welcome to SmartScale AI! I'm here to answer your questions about our services."
  ],
  services: [
    "SmartScale AI offers several services including AI Strategy & Consulting, AI Implementation, Process Automation, Predictive Analytics, and AI Training. Which one interests you most?",
    "Our most popular services include custom AI solution development, predictive analytics implementation, and AI strategy consulting. Would you like details about any of these?",
    "We specialize in making AI accessible to businesses of all sizes. Our services range from strategy development to full implementation and training. What specific service are you interested in?"
  ],
  pricing: [
    "Our pricing is customized based on your specific needs and project scope. Would you like our team to contact you with a personalized quote?",
    "We offer flexible pricing options designed for businesses of all sizes. The best way to get accurate pricing is to schedule a free consultation with our team. Should I help you set that up?",
    "SmartScale AI provides tailored solutions with pricing that scales with your business. For detailed pricing information, our team would be happy to discuss your specific requirements."
  ],
  contact: [
    "You can reach our team at info@smartscaleai.ai or call us at (386)473-2002. Would you prefer I help you schedule a call instead?",
    "The best way to get in touch is through our contact form or by emailing info@smartscaleai.ai. Would you like me to direct you to our contact section?",
    "Our team is available at (386)473-2002 or via email at info@smartscaleai.ai. You can also fill out the contact form on this website. How would you prefer to connect?"
  ],
  // New category for training
  training: [
    "I'm now in training mode! You can teach me by typing a question or keyword pattern, followed by the response you want me to give.",
    "Training mode activated! Please teach me what to say when users ask something.",
    "Ready to learn! Type in a question or phrase that a user might ask, and I'll remember it along with your response."
  ]
};

// Function to get custom responses from localStorage
function getCustomResponses(): { patterns: TrainingEntry[] } {
  const stored = localStorage.getItem('sparky-custom-responses');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored responses:", e);
      return { patterns: [] };
    }
  }
  return { patterns: [] };
}

// Function to save custom responses to localStorage
function saveCustomResponses(patterns: TrainingEntry[]) {
  localStorage.setItem('sparky-custom-responses', JSON.stringify({ patterns }));
}

// Enhanced response system with custom pattern matching
function getBotResponse(userMessage: string): string {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // First check for custom trained responses
  const customResponses = getCustomResponses();
  
  for (const entry of customResponses.patterns) {
    const pattern = entry.pattern.toLowerCase();
    // Check if user message contains the pattern
    if (lowerCaseMessage.includes(pattern)) {
      return entry.response;
    }
  }
  
  // Fall back to default categorization if no custom match
  if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hey")) {
    return getRandomResponse("greeting");
  } else if (lowerCaseMessage.includes("service") || lowerCaseMessage.includes("offer") || lowerCaseMessage.includes("provide")) {
    return getRandomResponse("services");
  } else if (lowerCaseMessage.includes("price") || lowerCaseMessage.includes("cost") || lowerCaseMessage.includes("much")) {
    return getRandomResponse("pricing");
  } else if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("email") || lowerCaseMessage.includes("phone")) {
    return getRandomResponse("contact");
  } else {
    return getRandomResponse("default");
  }
}

function getRandomResponse(category: string): string {
  const responses = defaultBotResponses[category] || defaultBotResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [characterState, setCharacterState] = useState<"idle" | "talking" | "thinking">("idle");
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [trainingStage, setTrainingStage] = useState<"pattern" | "response">("pattern");
  const [trainingPattern, setTrainingPattern] = useState("");
  const [customPatterns, setCustomPatterns] = useState<TrainingEntry[]>([]);
  const [showTrainingPanel, setShowTrainingPanel] = useState(false);
  const [useWebSocketChat, setUseWebSocketChat] = useState(false);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize WebSocket connection
  const { 
    isConnected, 
    lastMessage, 
    sendMessage,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket
  } = useWebSocket({
    onMessage: (message) => {
      // Handle incoming WebSocket messages
      if (message.type === 'chat') {
        // Add message to the chat if it's from the server
        if (message.sender === 'bot') {
          const wsMessage: Message = {
            id: messages.length + 1,
            text: message.message,
            sender: "bot",
            timestamp: new Date(message.timestamp || new Date())
          };
          
          setMessages(prev => [...prev, wsMessage]);
          setIsBotThinking(false);
          setCharacterState("talking");
          
          // Return to idle state after "talking"
          setTimeout(() => {
            setCharacterState("idle");
          }, 2000);
        }
      } else if (message.type === 'welcome') {
        // Connection established with server
        console.log('WebSocket connected:', message.message);
      }
    },
    onConnect: () => {
      console.log('WebSocket connected successfully');
      // Add connection notification
      if (isOpen && useWebSocketChat) {
        const connectionMessage: Message = {
          id: messages.length + 1,
          text: "Connected to live chat server. You can now chat with the AI team!",
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, connectionMessage]);
      }
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
      // Add disconnection notification if chat is open
      if (isOpen && useWebSocketChat) {
        const disconnectionMessage: Message = {
          id: messages.length + 1,
          text: "Disconnected from live chat server. Switched to local bot responses.",
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, disconnectionMessage]);
        setUseWebSocketChat(false);
      }
    }
  });
  
  // Load custom patterns on first render
  useEffect(() => {
    const savedPatterns = getCustomResponses();
    setCustomPatterns(savedPatterns.patterns || []);
  }, []);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Reset states when closing
    if (isOpen) {
      setCharacterState("idle");
      setShowTrainingPanel(false);
    }
  };
  
  const toggleTrainingMode = () => {
    setIsTrainingMode(!isTrainingMode);
    if (!isTrainingMode) {
      // Entering training mode - add a message from Sparky
      const trainingStartMessage: Message = {
        id: messages.length + 1,
        text: getRandomResponse("training"),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, trainingStartMessage]);
      setTrainingStage("pattern");
    } else {
      // Exiting training mode - reset training-related states
      setTrainingStage("pattern");
      setTrainingPattern("");
    }
  };
  
  const toggleTrainingPanel = () => {
    setShowTrainingPanel(!showTrainingPanel);
  };
  
  const handleTrainingAdd = (pattern: string, response: string) => {
    // Add new training pattern
    const newEntry: TrainingEntry = {
      pattern: pattern,
      response: response,
      category: "custom"
    };
    
    const updatedPatterns = [...customPatterns, newEntry];
    setCustomPatterns(updatedPatterns);
    saveCustomResponses(updatedPatterns);
    
    // Confirm to user
    const confirmationMessage: Message = {
      id: messages.length + 1,
      text: `I've learned that when someone mentions "${pattern}", I should respond with "${response}". Is there anything else you'd like to teach me?`,
      sender: "bot",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    setTrainingStage("pattern");
    setTrainingPattern("");
  };
  
  const deleteTrainingPattern = (index: number) => {
    const updatedPatterns = [...customPatterns];
    updatedPatterns.splice(index, 1);
    setCustomPatterns(updatedPatterns);
    saveCustomResponses(updatedPatterns);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: currentMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    const userMessageText = currentMessage;
    setCurrentMessage("");
    
    // Handle differently based on mode
    if (isTrainingMode) {
      if (trainingStage === "pattern") {
        // Store the pattern and move to response stage
        setTrainingPattern(userMessageText);
        setTrainingStage("response");
        
        // Add a bot message asking for the response
        const promptMessage: Message = {
          id: messages.length + 2,
          text: `Now, tell me how I should respond when someone asks about "${userMessageText}":`,
          sender: "bot",
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, promptMessage]);
        }, 500);
        
      } else {
        // We have both pattern and response, save them
        handleTrainingAdd(trainingPattern, userMessageText);
        setTrainingStage("pattern");
      }
    } else if (useWebSocketChat && isConnected) {
      // Real-time chat mode via WebSocket
      setIsBotThinking(true);
      setCharacterState("thinking");
      
      // Send message to server via WebSocket
      sendMessage({
        type: 'chat',
        sender: 'user',
        message: userMessageText,
        timestamp: new Date().toISOString()
      });
      
      // If no response in 5 seconds, use local bot
      const fallbackTimer = setTimeout(() => {
        if (isBotThinking) {
          const botResponse: Message = {
            id: messages.length + 2,
            text: "I didn't get a response from the server. " + getBotResponse(userMessageText),
            sender: "bot",
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botResponse]);
          setIsBotThinking(false);
          setCharacterState("talking");
          
          setTimeout(() => {
            setCharacterState("idle");
          }, 2000);
        }
      }, 5000);
      
      return () => clearTimeout(fallbackTimer);
    } else {
      // Normal local chat mode
      setIsBotThinking(true);
      setCharacterState("thinking");
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: getBotResponse(userMessageText),
          sender: "bot",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsBotThinking(false);
        setCharacterState("talking");
        
        // Return to idle state after "talking"
        setTimeout(() => {
          setCharacterState("idle");
        }, 2000);
      }, 1500);
    }
  };
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Focus input when chat opens
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);
  
  return (
    <>
      {/* Chat toggle button with character */}
      <div className="fixed bottom-5 right-5 z-50">
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative cursor-pointer group"
              onClick={toggleChat}
            >
              {/* Character bubble */}
              <div className="absolute -top-16 right-0 bg-white p-3 rounded-xl shadow-md 
                           max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           before:content-[''] before:absolute before:bottom-[-8px] before:right-7
                           before:w-4 before:h-4 before:bg-white before:rotate-45">
                <p className="text-gray-800 text-sm">Need help with AI solutions?</p>
              </div>
              
              {/* Character avatar */}
              <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center shadow-lg 
                           hover:shadow-primary/50 transition-all duration-300 border-2 border-white overflow-hidden">
                <div className="relative w-full h-full">
                  {/* Base robot face */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Animated sparkle effect */}
                  <motion.div 
                    className="absolute top-1/4 right-1/4"
                    animate={{ 
                      rotate: [0, 45, 0, -45, 0],
                      scale: [1, 1.2, 1, 1.2, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3,
                      repeatType: "loop"
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white rounded-xl shadow-xl w-80 sm:w-96 max-h-[600px] flex flex-col overflow-hidden"
            >
              {/* Chat header */}
              <div className="bg-primary p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Character avatar */}
                  <div className="relative h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                    
                    {/* Animated state indicator */}
                    {characterState === "thinking" && (
                      <motion.div 
                        className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                    {characterState === "talking" && (
                      <motion.div 
                        className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  
                  <div className="text-white">
                    <h3 className="font-medium text-sm">Sparky</h3>
                    <p className="text-xs text-white/70">
                      {isTrainingMode ? (
                        <span className="flex items-center gap-1">
                          <PlusCircle className="w-3 h-3" /> Training Mode
                        </span>
                      ) : useWebSocketChat && isConnected ? (
                        <span className="flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-green-300" /> Live Chat
                        </span>
                      ) : (
                        "AI Assistant"
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* WebSocket connection toggle */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      if (useWebSocketChat) {
                        disconnectWebSocket();
                        setUseWebSocketChat(false);
                      } else {
                        connectWebSocket();
                        setUseWebSocketChat(true);
                      }
                    }} 
                    className="text-white hover:bg-white/20"
                    title={useWebSocketChat ? "Disconnect from Live Chat" : "Connect to Live Chat"}
                  >
                    {isConnected && useWebSocketChat ? (
                      <Wifi className="h-4 w-4 text-green-300" />
                    ) : (
                      <WifiOff className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {/* Training mode toggle */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleTrainingMode} 
                    className="text-white hover:bg-white/20"
                    title={isTrainingMode ? "Exit Training Mode" : "Enter Training Mode"}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  
                  {/* Training panel toggle */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleTrainingPanel} 
                    className="text-white hover:bg-white/20"
                    title="View/Edit Training Patterns"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  {/* Close button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleChat} 
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Live chat indicator banner */}
              {useWebSocketChat && isConnected && (
                <div className="bg-green-100 text-green-800 px-4 py-2 text-xs flex items-center gap-2">
                  <Wifi className="h-3 w-3" />
                  <span>Connected to live chat service</span>
                </div>
              )}

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-xl p-3 shadow-sm",
                      message.sender === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    )}>
                      {message.sender === "bot" && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-primary">Sparky</span>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className="text-[10px] mt-1 opacity-70 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Bot thinking indicator */}
                {isBotThinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-primary">Sparky</span>
                      </div>
                      <div className="flex gap-1">
                        <motion.div 
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div 
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div 
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messageEndRef} />
              </div>
              
              {/* Training Panel */}
              {showTrainingPanel && (
                <div className="border-t border-gray-200 p-3 max-h-[200px] overflow-y-auto">
                  <h4 className="font-medium text-sm mb-2 flex items-center justify-between">
                    <span>Training Patterns ({customPatterns.length})</span>
                    {customPatterns.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => {
                          if(confirm("Are you sure you want to clear all training data?")) {
                            setCustomPatterns([]);
                            saveCustomResponses([]);
                          }
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                  </h4>
                  
                  {customPatterns.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No training patterns yet. Enter training mode to teach Sparky.</p>
                  ) : (
                    <div className="space-y-2">
                      {customPatterns.map((pattern, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded-md text-xs relative group">
                          <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteTrainingPattern(index)}
                            >
                              <Trash className="h-3 w-3 text-gray-500 hover:text-red-500" />
                            </Button>
                          </div>
                          <div className="font-medium">Pattern: <span className="text-primary">{pattern.pattern}</span></div>
                          <div className="mt-1 pr-6">Response: {pattern.response}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Input area */}
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
                {isTrainingMode && trainingStage === "pattern" && (
                  <div className="mb-2 p-2 bg-yellow-50 rounded-md text-xs text-yellow-800">
                    <strong>Training:</strong> Type a phrase or question you want Sparky to recognize
                  </div>
                )}
                
                {isTrainingMode && trainingStage === "response" && (
                  <div className="mb-2 p-2 bg-green-50 rounded-md text-xs text-green-800">
                    <strong>Training:</strong> Now type the response Sparky should give to "{trainingPattern}"
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder={isTrainingMode 
                      ? (trainingStage === "pattern" 
                        ? "Enter keyword or question pattern..." 
                        : "Enter the response Sparky should give...")
                      : "Type your message..."}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="bg-primary hover:bg-primary/90 text-white"
                    disabled={!currentMessage.trim() || isBotThinking}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-[10px] text-gray-500">
                    Powered by <GradientText as="span" className="font-medium">SmartScale AI</GradientText>
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}