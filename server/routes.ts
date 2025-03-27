import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const contactData = insertContactSchema.parse(req.body);
      
      // Store the contact submission
      const submission = await storage.createContactSubmission(contactData);
      
      // Return success response
      // In a real implementation, this would send an email to info@smartscaleai.ai
      console.log(`Email would be sent to info@smartscaleai.ai with data: ${JSON.stringify(contactData)}`);
      
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

  return httpServer;
}
