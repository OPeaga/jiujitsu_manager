import { Router } from 'express';
import { query } from '../lib/db.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Treinos
 *   description: Contador de treinos
 */

/**
 * @swagger
 * /api/training:
 *   get:
 *     summary: Retorna o total de treinos
 *     tags: [Treinos]
 *     responses:
 *       200:
 *         description: Contador atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT count FROM training_counter WHERE id = 1');
    res.json({ count: result.rows[0]?.count ?? 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/training:
 *   post:
 *     summary: Incrementa o contador de treinos (+1)
 *     tags: [Treinos]
 *     responses:
 *       200:
 *         description: Novo valor
 */
router.post('/', async (req, res) => {
  try {
    const result = await query(
      'UPDATE training_counter SET count = count + 1 WHERE id = 1 RETURNING count'
    );
    res.json({ count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
