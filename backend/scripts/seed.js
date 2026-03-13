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

const techniques = [
  { name: 'Armlock', japanese_name: '腕がらみ (Ude Garami)', image_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600', video_url: 'https://www.youtube.com/watch?v=U0MhKKKQrB4', notes: 'Chave de braço aplicada do mount ou da guarda fechada.', learned: true },
  { name: 'Triângulo', japanese_name: '三角絞め (Sankaku Jime)', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600', video_url: 'https://www.youtube.com/watch?v=KK3kKw07jMY', notes: 'Estrangulamento usando as pernas em formato de triângulo, aplicado da guarda.', learned: true },
  { name: 'Kimura', japanese_name: '上四方固め (Kami Shiho Gatame)', image_url: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600', video_url: '', notes: 'Chave dupla no braço — muito versátil do side control, guarda e turtle.', learned: false },
  { name: 'Rear Naked Choke', japanese_name: '裸絞め (Hadaka Jime)', image_url: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=600', video_url: '', notes: 'Estrangulamento pelas costas no back control. Técnica clássica e eficaz.', learned: false },
  { name: 'Omoplata', japanese_name: '肩固め (Kata Gatame)', image_url: 'https://images.unsplash.com/photo-1535743686920-55e4145369b9?w=600', video_url: '', notes: 'Chave de ombro usando as pernas, aplicada da guarda fechada ou aberta.', learned: false },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Inserindo técnicas...\n');
    for (const t of techniques) {
      await client.query(
        `INSERT INTO techniques (name, japanese_name, image_url, video_url, notes, learned) VALUES ($1,$2,$3,$4,$5,$6)`,
        [t.name, t.japanese_name, t.image_url, t.video_url, t.notes, t.learned]
      );
      console.log(`  ✅  ${t.name}`);
    }
    console.log('\n🎉 Seed concluído!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
