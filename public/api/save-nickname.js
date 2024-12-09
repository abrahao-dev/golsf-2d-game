// api/save-nickname.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const connection = await mysql.createConnection({
    host: 'mysql.doctusedtech.com.br',
    user: 'doctusedtech06',
    password: 'AulaUSF2024',
    database: 'doctusedtech06'
  });

  try {
    const { playerName, score } = req.body;

    // Check if player exists
    const [existingPlayers] = await connection.execute(
      'SELECT * FROM scores WHERE player_name = ?', 
      [playerName]
    );

    if (existingPlayers.length > 0) {
      return res.status(400).json({ error: 'Nickname já existe' });
    }

    // Insert new player
    const [result] = await connection.execute(
      'INSERT INTO scores (player_name, score) VALUES (?, ?)',
      [playerName, score]
    );

    res.status(201).json({ 
      id: result.insertId, 
      playerName, 
      score 
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  } finally {
    await connection.end();
  }
}