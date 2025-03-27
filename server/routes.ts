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

  return httpServer;
}
