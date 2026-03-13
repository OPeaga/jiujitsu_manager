import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import techniquesRouter from './routes/techniques.js';
import trainingRouter from './routes/training.js';
import beltRouter from './routes/belt.js';
import { requireApiKey } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Swagger ─────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🥋 Jiu Jitsu Manager API',
      version: '1.0.0',
      description: 'API para gerenciar técnicas de Jiu Jitsu, treinos e faixas.',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      schemas: {
        Technique: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string', example: 'Armlock' },
            japanese_name: { type: 'string', example: '腕がらみ (Ude Garami)' },
            image_url: { type: 'string' },
            video_url: { type: 'string' },
            notes: { type: 'string' },
            learned: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        TechniqueInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            japanese_name: { type: 'string' },
            image_url: { type: 'string' },
            video_url: { type: 'string' },
            notes: { type: 'string' },
            learned: { type: 'boolean' },
          },
        },
        BeltInput: {
          type: 'object',
          required: ['belt', 'degree'],
          properties: {
            belt: { type: 'string', enum: ['branca', 'azul', 'roxo', 'marrom', 'preta'] },
            degree: { type: 'integer', minimum: 0, maximum: 4 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const spec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
app.get('/api/openapi.json', (_req, res) => res.json(spec));

// ─── Health check (pública) ──────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ─── Security Middleware ─────────────────────────────────
app.use('/api', requireApiKey);

// ─── Routes (protegidas) ─────────────────────────────────
app.use('/api/techniques', techniquesRouter);
app.use('/api/training', trainingRouter);
app.use('/api/belt', beltRouter);

app.listen(PORT, () => {
  console.log(`\n🥋  API rodando em  http://localhost:${PORT}`);
  console.log(`📖  Swagger UI em  http://localhost:${PORT}/api-docs\n`);
});
