import { getDb } from '../src/lib/db.js';

const techniques = [
  { name: 'Armlock', japanese_name: '腕がらみ (Ude Garami)', image_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600', video_url: 'https://www.youtube.com/watch?v=U0MhKKKQrB4', notes: 'Chave de braço aplicada do mount ou da guarda fechada.', learned: 1 },
  { name: 'Triângulo', japanese_name: '三角絞め (Sankaku Jime)', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600', video_url: 'https://www.youtube.com/watch?v=KK3kKw07jMY', notes: 'Estrangulamento usando as pernas em formato de triângulo, aplicado da guarda.', learned: 1 },
  { name: 'Kimura', japanese_name: '上四方固め (Kami Shiho Gatame)', image_url: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600', video_url: '', notes: 'Chave dupla no braço — muito versátil do side control, guarda e turtle.', learned: 0 },
  { name: 'Rear Naked Choke', japanese_name: '裸絞め (Hadaka Jime)', image_url: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=600', video_url: '', notes: 'Estrangulamento pelas costas no back control. Técnica clássica e eficaz.', learned: 0 },
  { name: 'Omoplata', japanese_name: '肩固め (Kata Gatame)', image_url: 'https://images.unsplash.com/photo-1535743686920-55e4145369b9?w=600', video_url: '', notes: 'Chave de ombro usando as pernas, aplicada da guarda fechada ou aberta.', learned: 0 },
];

async function seed() {
  try {
    const db = await getDb();
    
    // Verifica se já existem técnicas para não duplicar toda vez que o dev rodar
    const countRes = await db.get('SELECT COUNT(*) as count FROM techniques');
    if (countRes.count > 0) {
      console.log('🌱 Banco já populado. Pulando seed de técnicas.');
      return;
    }

    console.log('🌱 Inserindo técnicas...\n');
    for (const t of techniques) {
      await db.run(
        `INSERT INTO techniques (name, japanese_name, image_url, video_url, notes, learned) VALUES (?,?,?,?,?,?)`,
        [t.name, t.japanese_name, t.image_url, t.video_url, t.notes, t.learned]
      );
      console.log(`  ✅  ${t.name}`);
    }
    console.log('\n🎉 Seed concluído!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

seed();
