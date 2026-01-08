import 'dotenv/config';
import app from './app.js';
import AppDataSource from './config/db.config.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start', error);
    process.exit(1);
  }
}

startServer();
