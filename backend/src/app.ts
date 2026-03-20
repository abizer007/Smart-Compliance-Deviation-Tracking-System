import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import sopRoutes from './routes/sop.routes';
import deviationRoutes from './routes/deviation.routes';
import capaRoutes from './routes/capa.routes';
import auditRoutes from './routes/audit.routes';
import analyticsRoutes from './routes/analytics.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.use('/auth', authRoutes);
app.use('/sop', sopRoutes);
app.use('/deviation', deviationRoutes);
app.use('/capa', capaRoutes);
app.use('/audit', auditRoutes);
app.use('/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
