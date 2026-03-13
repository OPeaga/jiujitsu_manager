import { Router } from 'express';
import { query } from '../lib/db.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Técnicas
 *   description: CRUD de técnicas de Jiu Jitsu
 */

/**
 * @swagger
 * /api/techniques:
 *   get:
 *     summary: Lista todas as técnicas
 *     tags: [Técnicas]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [learned, not_learned]
 *     responses:
 *       200:
 *         description: Lista de técnicas
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM techniques ORDER BY created_at DESC';
    if (status === 'learned') sql = 'SELECT * FROM techniques WHERE learned = true ORDER BY created_at DESC';
    else if (status === 'not_learned') sql = 'SELECT * FROM techniques WHERE learned = false ORDER BY created_at DESC';
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/techniques/{id}:
 *   get:
 *     summary: Busca técnica por ID
 *     tags: [Técnicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Técnica encontrada
 *       404:
 *         description: Não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM techniques WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/techniques:
 *   post:
 *     summary: Cria nova técnica
 *     tags: [Técnicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechniqueInput'
 *     responses:
 *       201:
 *         description: Criada
 */
router.post('/', async (req, res) => {
  try {
    const { name, japanese_name, image_url, video_url, notes, learned } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
    const result = await query(
      `INSERT INTO techniques (name, japanese_name, image_url, video_url, notes, learned)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, japanese_name||null, image_url||null, video_url||null, notes||null, learned??false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/techniques/{id}:
 *   put:
 *     summary: Atualiza técnica
 *     tags: [Técnicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechniqueInput'
 *     responses:
 *       200:
 *         description: Atualizada
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, japanese_name, image_url, video_url, notes, learned } = req.body;
    const result = await query(
      `UPDATE techniques SET
        name=COALESCE($1,name), japanese_name=COALESCE($2,japanese_name),
        image_url=COALESCE($3,image_url), video_url=COALESCE($4,video_url),
        notes=COALESCE($5,notes), learned=COALESCE($6,learned)
       WHERE id=$7 RETURNING *`,
      [name, japanese_name, image_url, video_url, notes, learned, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/techniques/{id}:
 *   delete:
 *     summary: Remove técnica
 *     tags: [Técnicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Removida
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM techniques WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Não encontrada' });
    res.json({ message: 'Técnica removida' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
