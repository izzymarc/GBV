import { 
  users, type User, type InsertUser, 
  type Assessment, type InsertAssessment, type UpdateAssessment
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assessment methods
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAllAssessments(): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, assessment: UpdateAssessment): Promise<Assessment | undefined>;
}

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
      updatedAt: now 
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
}

export const storage = new MemStorage();
