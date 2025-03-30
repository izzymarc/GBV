import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { log } from "./vite";

// Simple authentication middleware for admin routes
const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // In a production environment, you would implement proper authentication
  // For now, we're allowing all access for demonstration
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Assessments API routes
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid assessment ID" });
      }

      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = req.body;
      
      // Validate the request body
      if (!assessmentData || !assessmentData.data) {
        return res.status(400).json({ message: "Invalid assessment data" });
      }

      const newAssessment = await storage.createAssessment({
        data: assessmentData.data,
        completed: assessmentData.completed || false
      });

      res.status(201).json(newAssessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  app.put("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid assessment ID" });
      }

      const assessmentData = req.body;
      
      // Validate the request body
      if (!assessmentData || !assessmentData.data) {
        return res.status(400).json({ message: "Invalid assessment data" });
      }

      const updatedAssessment = await storage.updateAssessment(id, {
        data: assessmentData.data,
        completed: assessmentData.completed || false
      });

      if (!updatedAssessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      res.json(updatedAssessment);
    } catch (error) {
      console.error("Error updating assessment:", error);
      res.status(500).json({ message: "Failed to update assessment" });
    }
  });

  // Admin API routes
  app.get("/api/admin/assessments", adminAuthMiddleware, async (req, res) => {
    try {
      const assessmentData = await storage.exportAssessmentData();
      res.json(assessmentData);
    } catch (error) {
      log(`Error exporting assessment data: ${error}`, "admin-api");
      res.status(500).json({ 
        message: "Failed to export assessment data",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Health check endpoints with real database connection test
  app.get("/api/health", async (req, res) => {
    try {
      // First check if DATABASE_URL is configured
      if (!process.env.DATABASE_URL) {
        return res.json({ 
          status: "warning",
          message: "DATABASE_URL environment variable is not configured",
          timestamp: new Date().toISOString(),
          databaseConnected: false
        });
      }
      
      // Test database connection by running a simple query
      try {
        // Check if we can fetch a user or assessment as a quick test
        await storage.getAllAssessments();
        
        res.json({ 
          status: "ok",
          message: "API server is running and database is connected",
          timestamp: new Date().toISOString(),
          databaseConnected: true
        });
      } catch (dbError) {
        console.error("Database connection test failed:", dbError);
        res.json({ 
          status: "error",
          message: "Database connection failed: " + (dbError instanceof Error ? dbError.message : "Unknown error"),
          timestamp: new Date().toISOString(),
          databaseConnected: false
        });
      }
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({ 
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
        databaseConnected: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Duplicate health check endpoint with /healthcheck path for compatibility
  app.get("/api/healthcheck", async (req, res) => {
    try {
      // Forward to the main health check endpoint
      const response = await new Promise<any>((resolve) => {
        app._router.handle(
          { ...req, url: "/api/health", path: "/api/health" } as any,
          { ...res, end: resolve } as any
        );
      });
      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
        databaseConnected: false
      });
    }
  });

  // Database migrations endpoint (would implement in production with proper auth)
  app.post("/api/admin/run-migrations", adminAuthMiddleware, (req, res) => {
    // In a production app, this would trigger database migrations
    // For demonstration purposes, we just return success
    res.json({ 
      status: "success", 
      message: "Migrations would run here in a production environment"
    });
  });
  
  // Root route for checking the server status
  app.get("/api", (req, res) => {
    res.json({
      status: "server running",
      message: "Welcome to the GBV Psychosocial Assessment API",
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
