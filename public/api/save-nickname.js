// public/api/save-nickname.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql.doctusedtech.com.br',
  user: 'doctusedtech06',
  password: 'AulaUSF2024',
  database: 'doctusedtech06'
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { playerName, score } = req.body;

    // Verifica se o jogador já existe
    const checkQuery = 'SELECT * FROM scores WHERE player_name = ?';
    connection.query(checkQuery, [playerName], (err, results) => {
      if (err) {
        console.error('Erro ao verificar nickname:', err);
        return res.status(500).json({ error: 'Erro no banco de dados' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Nickname já existe' });
      }

      const query = 'INSERT INTO scores (player_name, score) VALUES (?, ?)';
      connection.query(query, [playerName, score], (err, results) => {
        if (err) {
          console.error('Erro ao salvar nickname:', err);
          return res.status(500).json({ error: 'Erro no banco de dados' });
        }
        res.status(201).json({ id: results.insertId, playerName, score });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};