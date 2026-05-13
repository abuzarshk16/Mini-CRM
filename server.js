import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import connectDB from './server/config/db.js';

// Route files
import authRoutes from './server/routes/authRoutes.js';
import leadRoutes from './server/routes/leadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Connect to database
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    console.warn('MONGODB_URI not found in environment variables. Database integration will not work.');
  }

  // Body parser
  app.use(express.json());

  // Enable CORS
  app.use(cors());

  // Mount routers
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
