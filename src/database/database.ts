import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('gastos.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS gastos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      categoria TEXT NOT NULL,
      valor REAL NOT NULL,
      data TEXT NOT NULL
    );
  `);
};

export const database = {
  insert: (descricao: string, categoria: string, valor: number, data: string) => {
    db.runSync(
      'INSERT INTO gastos (descricao, categoria, valor, data) VALUES (?, ?, ?, ?);',
      [descricao, categoria, valor, data]
    );
  },

  getAll: () => {
    return db.getAllSync('SELECT * FROM gastos ORDER BY id DESC;');
  },

  update: (id: number, descricao: string, categoria: string, valor: number, data: string) => {
    db.runSync(
      'UPDATE gastos SET descricao = ?, categoria = ?, valor = ?, data = ? WHERE id = ?;',
      [descricao, categoria, valor, data, id]
    );
  },

  delete: (id: number) => {
    db.runSync('DELETE FROM gastos WHERE id = ?;', [id]);
  }
};