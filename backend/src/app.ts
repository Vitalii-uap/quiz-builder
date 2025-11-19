import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import quizRoutes from './routes/quizRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', quizRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
