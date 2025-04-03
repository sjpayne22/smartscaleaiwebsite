// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/storage.ts
var MemStorage = class {
  users;
  contactSubmissions;
  userCurrentId;
  contactCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contactSubmissions = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
  }
  // User methods implementation
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Contact submission methods implementation
  async createContactSubmission(data) {
    const id = this.contactCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const submission = {
      id,
      name: data.name,
      email: data.email,
      company: data.company || null,
      phone: data.phone || null,
      message: data.message,
      createdAt: now
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
  async getContactSubmissions() {
    return Array.from(this.contactSubmissions.values());
  }
  async getContactSubmission(id) {
    return this.contactSubmissions.get(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  company: true,
  phone: true,
  message: true
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
function generateBotResponse(userMessage) {
  const lowerCaseMessage = userMessage.toLowerCase();
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
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}
async function registerRoutes(app2) {
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      console.log(`[Contact Form] Sending email to info@smartscaleai.ai`);
      console.log(`[Contact Form] From: ${contactData.name} <${contactData.email}>`);
      console.log(`[Contact Form] Company: ${contactData.company || "Not provided"}`);
      console.log(`[Contact Form] Phone: ${contactData.phone || "Not provided"}`);
      console.log(`[Contact Form] Message: ${contactData.message}`);
      const emailTemplate = `
        New Contact Form Submission
        --------------------------
        Name: ${contactData.name}
        Email: ${contactData.email}
        Company: ${contactData.company || "Not provided"}
        Phone: ${contactData.phone || "Not provided"}
        
        Message:
        ${contactData.message}
        
        This submission was received on ${(/* @__PURE__ */ new Date()).toLocaleString()}.
      `;
      console.log(`[Contact Form] Email Template: ${emailTemplate}`);
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
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    ws.send(JSON.stringify({
      type: "welcome",
      message: "Connected to SmartScale AI WebSocket server"
    }));
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received:", data);
        switch (data.type) {
          case "chat":
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: "chat",
                  sender: data.sender,
                  message: data.message,
                  timestamp: (/* @__PURE__ */ new Date()).toISOString()
                }));
              }
            });
            if (data.sender === "user") {
              setTimeout(() => {
                const botResponse = generateBotResponse(data.message);
                wss.clients.forEach((client) => {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                      type: "chat",
                      sender: "bot",
                      message: botResponse,
                      timestamp: (/* @__PURE__ */ new Date()).toISOString()
                    }));
                  }
                });
              }, 1500);
            }
            break;
          case "notification":
            ws.send(JSON.stringify({
              type: "notification",
              message: "Notification received",
              data
            }));
            break;
          default:
            ws.send(JSON.stringify({
              type: "error",
              message: "Unknown message type",
              originalData: data
            }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Error processing your message"
        }));
      }
    });
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
