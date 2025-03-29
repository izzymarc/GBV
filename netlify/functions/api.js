import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { drizzle } from 'drizzle-orm';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';

// We'll import our schemas directly
// This is a simplified version for Netlify Functions
// In a real deployment, you would adapt your server logic more carefully

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define schema (simplified version for Netlify)
// In a real deployment, you would import your schema from a shared file
// This is just a placeholder to demonstrate the concept
const users = {
  id: { name: 'id' },
  username: { name: 'username' },
  password: { name: 'password' },
  isAdmin: { name: 'is_admin' }
};

const assessments = {
  id: { name: 'id' },
  createdAt: { name: 'created_at' },
  updatedAt: { name: 'updated_at' },
  completed: { name: 'completed' },
  formData: { name: 'form_data' }
};

// Database Logic
const db = drizzle(pool);

// Basic storage
class PostgresStorage {
  async getUser(id) {
    const [user] = await db.select().from('users').where(eq('id', id));
    return user || undefined;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from('users').where(eq('username', username));
    return user || undefined;
  }

  async createUser(insertUser) {
    const [user] = await db.insert('users').values(insertUser).returning();
    return user;
  }

  async getAssessment(id) {
    const [assessment] = await db.select().from('assessments').where(eq('id', id));
    return assessment || undefined;
  }

  async getAllAssessments() {
    return await db.select().from('assessments');
  }

  async createAssessment(insertAssessment) {
    const [assessment] = await db.insert('assessments').values({
      ...insertAssessment,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    return assessment;
  }

  async updateAssessment(id, updateAssessment) {
    const [assessment] = await db
      .update('assessments')
      .set({
        ...updateAssessment,
        updated_at: new Date()
      })
      .where(eq('id', id))
      .returning();
    return assessment || undefined;
  }

  async exportAssessmentData() {
    const assessments = await db.select().from('assessments');
    const completeCount = assessments.filter(a => a.completed).length;
    const incompleteCount = assessments.length - completeCount;
    
    return {
      totalCount: assessments.length,
      completeCount,
      incompleteCount,
      data: assessments
    };
  }
}

const storage = new PostgresStorage();

// API Routes
app.get('/api', (req, res) => {
  res.json({
    status: "server running",
    message: "Welcome to the GBV Psychosocial Assessment API",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Assessment Routes
app.post('/api/assessments', async (req, res) => {
  try {
    const assessment = await storage.createAssessment({
      form_data: req.body,
      completed: false
    });
    res.status(201).json(assessment);
  } catch (err) {
    console.error('Error creating assessment:', err);
    res.status(500).json({ message: 'Failed to create assessment' });
  }
});

app.get('/api/assessments/:id', async (req, res) => {
  try {
    const assessment = await storage.getAssessment(parseInt(req.params.id));
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (err) {
    console.error('Error getting assessment:', err);
    res.status(500).json({ message: 'Error getting assessment' });
  }
});

app.put('/api/assessments/:id', async (req, res) => {
  try {
    const { completed, ...formData } = req.body;
    const assessment = await storage.updateAssessment(parseInt(req.params.id), {
      form_data: formData,
      completed: completed || false
    });
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (err) {
    console.error('Error updating assessment:', err);
    res.status(500).json({ message: 'Error updating assessment' });
  }
});

// Admin Routes
app.get('/api/admin/assessments', async (req, res) => {
  try {
    const data = await storage.exportAssessmentData();
    res.json(data);
  } catch (err) {
    console.error('Error exporting assessment data:', err);
    res.status(500).json({ message: 'Error exporting assessment data' });
  }
});

// Export the serverless function
export const handler = serverless(app);