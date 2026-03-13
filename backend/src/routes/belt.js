import { Router } from 'express';
import { query } from '../lib/db.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Faixa
 *   description: Histórico de faixas
 */

/**
 * @swagger
 * /api/belt:
 *   get:
 *     summary: Retorna faixa atual e histórico
 *     tags: [Faixa]
 *     responses:
 *       200:
 *         description: Dados da faixa
 */
router.get('/', async (req, res) => {
  try {
    const history = await query('SELECT * FROM belt_history ORDER BY updated_at DESC');
    res.json({ current: history.rows[0] || null, history: history.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/belt:
 *   post:
 *     summary: Registra nova faixa/grau
 *     tags: [Faixa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BeltInput'
 *     responses:
 *       201:
 *         description: Registrada
 */
router.post('/', async (req, res) => {
  try {
    const { belt, degree } = req.body;
    const valid = ['branca','azul','roxo','marrom','preta'];
    if (!valid.includes(belt)) return res.status(400).json({ error: `Faixa inválida. Use: ${valid.join(', ')}` });
    if (degree < 0 || degree > 4) return res.status(400).json({ error: 'Grau deve ser entre 0 e 4' });
    const result = await query(
      'INSERT INTO belt_history (belt, degree) VALUES ($1,$2) RETURNING *',
      [belt, degree]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
