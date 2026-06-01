import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import categoriesRoutes from './routes/categories.js';

dotenv.config();

const app = express();

// Middleware
// Smart CORS: accept localhost & cloud tunnel
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow cloud tunnel
    if (origin.includes('trycloudflare.com')) {
      return callback(null, true);
    }
    
    // Allow specific frontend URL from .env (for production)
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/categories', categoriesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Todo Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      tasks: {
        getTasks: 'GET /api/tasks',
        getTaskById: 'GET /api/tasks/:id',
        createTask: 'POST /api/tasks',
        updateTask: 'PUT /api/tasks/:id',
        deleteTask: 'DELETE /api/tasks/:id'
      },
      categories: {
        getCategories: 'GET /api/categories',
        createCategory: 'POST /api/categories'
      },
      health: 'GET /api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
