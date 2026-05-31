import app from './app.js';
import {connectDB} from './1-config/db.js';
import { env } from './1-config/env.js';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();