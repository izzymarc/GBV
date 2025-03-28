import { 
  users, assessments, type User, type InsertUser, 
  type Assessment, type InsertAssessment, type UpdateAssessment
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { log } from "./vite";
import { db } from "./db";

// Storage interface for CRUD operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assessment methods
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAllAssessments(): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, assessment: UpdateAssessment): Promise<Assessment | undefined>;
  
  // Admin methods
  exportAssessmentData(): Promise<{
    totalCount: number; 
    completeCount: number; 
    incompleteCount: number;
    data: Assessment[];
  }>;
}

// PostgreSQL Database Storage Implementation
export class PostgresStorage implements IStorage {
  constructor() {
    log("PostgreSQL storage initialized", "postgres");
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      log(`Error getting user: ${error}`, "postgres");
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      log(`Error getting user by username: ${error}`, "postgres");
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      log(`Error creating user: ${error}`, "postgres");
      throw error;
    }
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    try {
      const result = await db.select().from(assessments).where(eq(assessments.id, id));
      return result[0];
    } catch (error) {
      log(`Error getting assessment: ${error}`, "postgres");
      throw error;
    }
  }

  async getAllAssessments(): Promise<Assessment[]> {
    try {
      return await db.select().from(assessments).orderBy(desc(assessments.updatedAt));
    } catch (error) {
      log(`Error getting all assessments: ${error}`, "postgres");
      throw error;
    }
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    try {
      const now = new Date();
      const result = await db.insert(assessments).values({
        ...insertAssessment,
        completed: insertAssessment.completed || false, // Ensure completed is never undefined
        createdAt: now,
        updatedAt: now
      }).returning();
      return result[0];
    } catch (error) {
      log(`Error creating assessment: ${error}`, "postgres");
      throw error;
    }
  }

  async updateAssessment(id: number, updateAssessment: UpdateAssessment): Promise<Assessment | undefined> {
    try {
      const result = await db.update(assessments)
        .set({
          ...updateAssessment,
          updatedAt: new Date()
        })
        .where(eq(assessments.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      log(`Error updating assessment: ${error}`, "postgres");
      throw error;
    }
  }
  
  async exportAssessmentData(): Promise<{
    totalCount: number; 
    completeCount: number; 
    incompleteCount: number;
    data: Assessment[];
  }> {
    try {
      const allAssessments = await db.select().from(assessments).orderBy(desc(assessments.updatedAt));
      
      const completeAssessments = allAssessments.filter(a => a.completed);
      const incompleteAssessments = allAssessments.filter(a => !a.completed);
      
      return {
        totalCount: allAssessments.length,
        completeCount: completeAssessments.length,
        incompleteCount: incompleteAssessments.length,
        data: allAssessments
      };
    } catch (error) {
      log(`Error exporting assessment data: ${error}`, "postgres");
      throw error;
    }
  }
}

// Memory Storage Implementation (for fallback or testing)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  userCurrentId: number;
  assessmentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.userCurrentId = 1;
    this.assessmentCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAllAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.assessmentCurrentId++;
    const now = new Date();
    const assessment: Assessment = { 
      ...insertAssessment, 
      id,
      createdAt: now,
      updatedAt: now,
      completed: insertAssessment.completed || false // Ensure completed is never undefined
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: number, updateAssessment: UpdateAssessment): Promise<Assessment | undefined> {
    const existingAssessment = this.assessments.get(id);
    
    if (!existingAssessment) {
      return undefined;
    }
    
    const updatedAssessment = { 
      ...existingAssessment, 
      ...updateAssessment,
      updatedAt: new Date() 
    };
    
    this.assessments.set(id, updatedAssessment);
    return updatedAssessment;
  }
  
  async exportAssessmentData(): Promise<{
    totalCount: number; 
    completeCount: number; 
    incompleteCount: number;
    data: Assessment[];
  }> {
    const allAssessments = Array.from(this.assessments.values());
    
    const completeAssessments = allAssessments.filter(a => a.completed);
    const incompleteAssessments = allAssessments.filter(a => !a.completed);
    
    return {
      totalCount: allAssessments.length,
      completeCount: completeAssessments.length,
      incompleteCount: incompleteAssessments.length,
      data: allAssessments
    };
  }
}

// Use PostgreSQL storage in production
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();
