import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env.local') });

let dbPromise = null;

// Inicializa a conexão com o banco local
export async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, '..', '..', 'jiujitsu.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbPromise;
}

// Wrapper nativo para manter compatibilidade superficial com a interface do projeto Postgres antigo
export async function query(text, params) {
  const db = await getDb();
  
  // Converte variáveis do formato Postgres ($1, $2) para SQLite (?)
  const sqliteText = text.replace(/\$\d+/g, '?');
  
  // Se for SELECT ou contiver RETURNING, usamos db.all para retornar as linhas
  const isSelectOrReturning = sqliteText.trim().toUpperCase().startsWith('SELECT') || 
                              sqliteText.toUpperCase().includes('RETURNING');
                              
  if (isSelectOrReturning) {
    const rows = await db.all(sqliteText, params);
    // Transforma retornos do tipo { learned: 1 } em booleano para o front funcionar igual
    const formattedRows = rows.map(r => {
      if ('learned' in r) r.learned = r.learned === 1;
      return r;
    });
    return { rows: formattedRows };
  }
  
  // Para INSERT/UPDATE/DELETE sem RETURNING
  const result = await db.run(sqliteText, params);
  
  return { rows: [], rowCount: result.changes, lastID: result.lastID };
}
