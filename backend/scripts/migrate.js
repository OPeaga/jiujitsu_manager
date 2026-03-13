import { getDb } from '../src/lib/db.js';

async function migrate() {
  try {
    const db = await getDb();
    console.log('🔄 Criando tabelas...\n');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS techniques (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT NOT NULL,
        japanese_name TEXT,
        image_url     TEXT,
        video_url     TEXT,
        notes         TEXT,
        learned       BOOLEAN DEFAULT 0,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅  techniques');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS training_counter (
        id    INTEGER PRIMARY KEY DEFAULT 1,
        count INTEGER DEFAULT 0,
        CHECK (id = 1)
      );
      INSERT INTO training_counter (id, count)
      VALUES (1, 0) ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅  training_counter');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS belt_history (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        belt       TEXT NOT NULL,
        degree     INTEGER NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    const countRes = await db.get('SELECT COUNT(*) as count FROM belt_history');
    if (countRes.count === 0) {
      await db.run(`INSERT INTO belt_history (belt, degree) VALUES ('branca', 2)`);
      console.log('✅  belt_history  (padrão: branca 2 graus)');
    } else {
      console.log('✅  belt_history');
    }

    console.log('\n🎉 Migration concluída!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

migrate();
