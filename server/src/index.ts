import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import sopRoutes from './routes/sopRoutes';
import deviationRoutes from './routes/deviationRoutes';
import capaRoutes from './routes/capaRoutes';
import auditRoutes from './routes/auditRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { prisma } from './prisma/client';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import commentRoutes from './routes/commentRoutes';
import searchRoutes from './routes/searchRoutes';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(helmet());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok' });
  } catch (e) {
    return res.status(500).json({ status: 'error', error: String(e) });
  }
});

app.use('/auth', authRoutes);
app.use('/sop', sopRoutes);
app.use('/deviations', deviationRoutes);
app.use('/capa', capaRoutes);
app.use('/audits', auditRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/upload', uploadRoutes);
app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);
app.use('/comments', commentRoutes);
app.use('/search', searchRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${env.port}`);
});

