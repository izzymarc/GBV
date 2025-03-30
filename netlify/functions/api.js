import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { Pool } from 'pg';

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

// Log database connection status
console.log(`PostgreSQL: Connecting to ${process.env.DATABASE_URL ? 'configured database' : 'no database configured'}`);

// Enhanced error logging for database operations
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

// Database Logic

// Basic storage
class PostgresStorage {
  async getUser(id) {
    try {
      // Use raw query for maximum compatibility
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Database error in getUser:', error);
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      // Use raw query for maximum compatibility
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Database error in getUserByUsername:', error);
      throw error;
    }
  }

  async createUser(insertUser) {
    try {
      // Using parameterized query for security and compatibility
      const { username, password, is_admin } = insertUser;
      const result = await pool.query(
        'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING *',
        [username, password, is_admin || false]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  }

  async getAssessment(id) {
    try {
      // Use raw query for maximum compatibility
      const result = await pool.query('SELECT * FROM assessments WHERE id = $1', [id]);
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Database error in getAssessment:', error);
      throw error;
    }
  }

  async getAllAssessments() {
    try {
      // Use raw query for maximum compatibility
      const result = await pool.query('SELECT * FROM assessments ORDER BY created_at');
      return result.rows;
    } catch (error) {
      console.error('Database error in getAllAssessments:', error);
      throw error;
    }
  }

  async createAssessment(insertAssessment) {
    try {
      // Using parameterized query for security and compatibility
      const { completed, form_data } = insertAssessment;
      const result = await pool.query(
        'INSERT INTO assessments (created_at, updated_at, completed, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [new Date(), new Date(), completed || false, form_data]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Database error in createAssessment:', error);
      throw error;
    }
  }

  async updateAssessment(id, updateAssessment) {
    try {
      // Using parameterized query for security and compatibility
      const { completed, form_data } = updateAssessment;
      const result = await pool.query(
        'UPDATE assessments SET updated_at = $1, completed = $2, data = $3 WHERE id = $4 RETURNING *',
        [new Date(), completed || false, form_data, id]
      );
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Database error in updateAssessment:', error);
      throw error;
    }
  }

  async exportAssessmentData() {
    try {
      // Use raw query and transaction for maximum reliability
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Get all assessments
        const assessmentsResult = await client.query('SELECT * FROM assessments ORDER BY created_at');
        const assessments = assessmentsResult.rows;
        
        // Count completed assessments
        const completeCountResult = await client.query('SELECT COUNT(*) FROM assessments WHERE completed = true');
        const completeCount = parseInt(completeCountResult.rows[0].count);
        
        // Count total assessments
        const totalCountResult = await client.query('SELECT COUNT(*) FROM assessments');
        const totalCount = parseInt(totalCountResult.rows[0].count);
        
        await client.query('COMMIT');
        
        return {
          totalCount,
          completeCount,
          incompleteCount: totalCount - completeCount,
          data: assessments
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
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