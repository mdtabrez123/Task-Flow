import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load environment variables
dotenv.config();

// --- Environment Variable Check (from our last fix) ---
// Note: Removed process.exit(1) so Vercel builds don't crash when env vars aren't present yet
const { PORT = 5000, MONGO_URI, JWT_SECRET } = process.env;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in .env file');
}
if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in .env file');
}

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://task-management-one-blush.vercel.app',
  'https://task-management-master-dv49.vercel.app',
  'https://task-management-master-vert.vercel.app'
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200
  })
);

// Connect to DB immediately for Vercel
if (process.env.MONGO_URI) {
  connectDB().catch(console.dir);
}

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connecting error', error: error.message });
  }
});

app.use(express.json()); // Allow server to accept JSON

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

// Start the server
const startServer = async () => {
  try {
    // Wait for the DB to connect before starting the server
    if (MONGO_URI) {
      await connectDB(MONGO_URI);
    }
    
    // Global Error Handlers (no change)
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection: ${err.message}`);
    });
    process.on('uncaughtException', (err) => {
      console.error(`Uncaught Exception: ${err.message}`);
    });

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Environment variables loaded successfully.');
      console.log('CORS allowed origins:', allowedOrigins);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Start the server
// IMPORTANT for Vercel: We also export the 'app' 
startServer();
export default app;