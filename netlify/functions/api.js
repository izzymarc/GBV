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
  // This configuration is more compatible with Netlify's environment
  // We allow the netlify domain and any custom domains you might use
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if(!origin) return callback(null, true);
    
    // Allow all origins in development, but could be restricted in production
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[Netlify Function] ${req.method} ${req.url}`);
  next();
});

// Initialize database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define schema for Netlify functions
const schema = {
  users: {
    id: { name: 'id' },
    username: { name: 'username' },
    password: { name: 'password' },
    isAdmin: { name: 'is_admin' }
  },
  assessments: {
    id: { name: 'id' },
    createdAt: { name: 'created_at' },
    updatedAt: { name: 'updated_at' },
    completed: { name: 'completed' },
    formData: { name: 'form_data' }
  }
};

// Database Logic
const db = drizzle(pool);

// Basic storage
class PostgresStorage {
  async getUser(id) {
    try {
      const [user] = await db.select().from('users').where(eq('users.id', id));
      return user || undefined;
    } catch (error) {
      console.error('Database error in getUser:', error);
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      const [user] = await db.select().from('users').where(eq('users.username', username));
      return user || undefined;
    } catch (error) {
      console.error('Database error in getUserByUsername:', error);
      throw error;
    }
  }

  async createUser(insertUser) {
    try {
      const [user] = await db.insert('users').values(insertUser).returning();
      return user;
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  }

  async getAssessment(id) {
    try {
      const [assessment] = await db.select().from('assessments').where(eq('assessments.id', id));
      return assessment || undefined;
    } catch (error) {
      console.error('Database error in getAssessment:', error);
      throw error;
    }
  }

  async getAllAssessments() {
    try {
      return await db.select().from('assessments').orderBy('assessments.created_at');
    } catch (error) {
      console.error('Database error in getAllAssessments:', error);
      throw error;
    }
  }

  async createAssessment(insertAssessment) {
    try {
      const [assessment] = await db.insert('assessments').values({
        ...insertAssessment,
        created_at: new Date(),
        updated_at: new Date()
      }).returning();
      return assessment;
    } catch (error) {
      console.error('Database error in createAssessment:', error);
      throw error;
    }
  }

  async updateAssessment(id, updateAssessment) {
    try {
      const [assessment] = await db
        .update('assessments')
        .set({
          ...updateAssessment,
          updated_at: new Date()
        })
        .where(eq('assessments.id', id))
        .returning();
      return assessment || undefined;
    } catch (error) {
      console.error('Database error in updateAssessment:', error);
      throw error;
    }
  }

  async exportAssessmentData() {
    try {
      const assessments = await db.select().from('assessments').orderBy('assessments.created_at');
      const completeCount = assessments.filter(a => a.completed).length;
      const incompleteCount = assessments.length - completeCount;
      
      return {
        totalCount: assessments.length,
        completeCount,
        incompleteCount,
        data: assessments
      };
    } catch (error) {
      console.error('Database error in exportAssessmentData:', error);
      throw error;
    }
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

app.get('/api/health', async (req, res) => {
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
      // Check if we can fetch assessments as a quick test
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
        message: "Database connection failed: " + (dbError.message || "Unknown error"),
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
      error: error.message || "Unknown error"
    });
  }
});

// Duplicate health check endpoint for compatibility
app.get('/api/healthcheck', async (req, res) => {
  try {
    // Forward to the main health check response
    const response = await new Promise((resolve) => {
      app._router.handle(
        { ...req, url: "/api/health", path: "/api/health" },
        { ...res, end: resolve }
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
    console.log("[Admin API] Attempting to export assessment data...");
    
    // Test the database connection before proceeding
    try {
      await pool.query('SELECT NOW()');
      console.log("[Admin API] Database connection successful");
    } catch (dbError) {
      console.error("[Admin API] Database connection error:", dbError);
      return res.status(500).json({ 
        message: 'Database connection error', 
        error: dbError.message,
        details: "Check your DATABASE_URL environment variable in Netlify settings"
      });
    }
    
    const data = await storage.exportAssessmentData();
    console.log("[Admin API] Successfully retrieved assessment data:", 
      JSON.stringify({
        totalCount: data.totalCount,
        completeCount: data.completeCount,
        incompleteCount: data.incompleteCount,
        dataLength: data.data ? data.data.length : 0
      })
    );
    
    res.json(data);
  } catch (err) {
    console.error('[Admin API] Error exporting assessment data:', err);
    res.status(500).json({ 
      message: 'Error exporting assessment data',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Export the serverless function
export const handler = serverless(app);