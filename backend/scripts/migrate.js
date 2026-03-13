import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Criando tabelas...\n');

    await client.query(`
      CREATE TABLE IF NOT EXISTS techniques (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(255) NOT NULL,
        japanese_name VARCHAR(255),
        image_url     TEXT,
        video_url     TEXT,
        notes         TEXT,
        learned       BOOLEAN DEFAULT FALSE,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  techniques');

    await client.query(`
      CREATE TABLE IF NOT EXISTS training_counter (
        id    INT PRIMARY KEY DEFAULT 1,
        count INTEGER DEFAULT 0,
        CONSTRAINT single_row CHECK (id = 1)
      );
      INSERT INTO training_counter (id, count)
      VALUES (1, 0) ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅  training_counter');

    await client.query(`
      CREATE TABLE IF NOT EXISTS belt_history (
        id         SERIAL PRIMARY KEY,
        belt       VARCHAR(50) NOT NULL,
        degree     INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    const { rows } = await client.query('SELECT COUNT(*) FROM belt_history');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`INSERT INTO belt_history (belt, degree) VALUES ('branca', 2)`);
      console.log('✅  belt_history  (padrão: branca 2 graus)');
    } else {
      console.log('✅  belt_history');
    }

    console.log('\n🎉 Migration concluída!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
