import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);

  return httpServer;
}
