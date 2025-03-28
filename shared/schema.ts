import { pgTable, text, serial, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// GBV Assessment schemas
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  data: jsonb("data").notNull(),
  completed: boolean("completed").default(false).notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  data: true,
  completed: true,
});

export const updateAssessmentSchema = createInsertSchema(assessments).pick({
  data: true,
  completed: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type UpdateAssessment = z.infer<typeof updateAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Form schema definition
export const formSchema = z.object({
  // Section 1: General Information
  generalInformation: z.object({
    age: z.string().optional(),
    sex: z.enum(['Male', 'Female']).optional(),
    ethnicity: z.string().optional(),
    education: z.string().optional(),
    maritalStatus: z.string().optional(),
    dependents: z.string().optional(),
    livingArrangement: z.string().optional(),
    employmentStatus: z.string().optional(),
    vulnerabilities: z.array(z.string()).default([]),
  }),
  
  // Section 2: Incident Details
  incidentDetails: z.object({
    location: z.string().optional(),
    violenceTypes: z.array(z.string()).default([]),
    perpetratorRelationship: z.string().optional(),
    frequency: z.string().optional(),
    exposure: z.string().optional(),
    reportingStatus: z.enum(['Yes', 'No']).optional(),
    servicesReceived: z.string().optional(),
    outcome: z.string().optional(),
  }),
  
  // Section 3: Anxiety Symptoms (GAD-7)
  anxietySymptoms: z.object({
    scores: z.array(z.number().min(0).max(3)).length(7).default([0, 0, 0, 0, 0, 0, 0]),
    totalScore: z.number().min(0).max(21).default(0),
  }),
  
  // Section 4: Depression Symptoms (PHQ-9)
  depressionSymptoms: z.object({
    scores: z.array(z.number().min(0).max(3)).length(9).default([0, 0, 0, 0, 0, 0, 0, 0, 0]),
    totalScore: z.number().min(0).max(27).default(0),
  }),
  
  // Section 5: Trauma Symptoms (PCL-5 + Trauma Bonding)
  traumaSymptoms: z.object({
    ptsdScores: z.array(z.number().min(0).max(4)).length(6).default([0, 0, 0, 0, 0, 0]),
    bondingScores: z.array(z.number().min(0).max(4)).length(10).default([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    ptsdTotalScore: z.number().min(0).max(24).default(0),
    bondingTotalScore: z.number().min(0).max(40).default(0),
  }),
  
  // Section 6: Social Support and Coping
  socialSupport: z.object({
    supportSources: z.array(z.string()).default([]),
    supportSatisfaction: z.number().min(1).max(5).default(3),
    copingMechanisms: z.array(z.string()).default([]),
    previousTherapy: z.enum(['Yes', 'No']).optional(),
    therapyDetails: z.string().optional(),
  }),
  
  // Section 7: Physical and Functional Well-being
  physicalWellbeing: z.object({
    overallHealth: z.string().optional(),
    physicalInjuries: z.array(z.string()).default([]),
    sexualHealthIssues: z.array(z.string()).default([]),
    medicalCareAccessed: z.enum(['Yes', 'No']).optional(),
    sleepDisturbances: z.array(z.string()).default([]),
    workImpact: z.string().optional(),
    healthcareBarriers: z.array(z.string()).default([]),
    unmetMedicalNeeds: z.string().optional(),
  }),
  
  // Section 8: Risk Assessment
  riskAssessment: z.object({
    suicidalThoughts: z.string().optional(),
    safetyFeeling: z.string().optional(),
    furtherHarmRisk: z.string().optional(),
    safetyPlanNeeded: z.enum(['Yes', 'No']).optional(),
  }),
  
  // Section 9: Program Expectations and Goals
  programExpectations: z.object({
    expectations: z.string().optional(),
    lifeChanges: z.string().optional(),
    priorities: z.array(z.string()).max(3).default([]),
    timeframe: z.string().optional(),
  }),
});

export type FormData = z.infer<typeof formSchema>;
