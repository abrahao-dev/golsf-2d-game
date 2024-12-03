const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());

// Middleware para parsear requisições JSON
app.use(express.json());

// Configure a conexão MySQL
const connection = mysql.createConnection({
  host: 'mysql.doctusedtech.com.br',
  user: 'doctusedtech06', // Usuário fornecido
  password: 'AulaUSF2024', // Senha fornecida
  database: 'doctusedtech06' // Nome do banco de dados correto
});

// Conectar ao banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Endpoint para salvar a pontuação de um jogador
app.post('/api/save-score', (req, res) => {
  const { playerName, score } = req.body;
  const query = 'INSERT INTO scores (player_name, score) VALUES (?, ?)';
  connection.query(query, [playerName, score], (err, results) => {
    if (err) {
      console.error('Erro ao salvar pontuação:', err);
      res.status(500).json({ error: 'Erro no banco de dados' });
      return;
    }
    res.status(201).json({ id: results.insertId, playerName, score });
  });
});

// Endpoint para salvar o nickname do jogador
app.post('/api/save-nickname', (req, res) => {
  const { playerName, score } = req.body;

  // Verifica se o jogador já existe
  const checkQuery = 'SELECT * FROM scores WHERE player_name = ?';
  connection.query(checkQuery, [playerName], (err, results) => {
    if (err) {
      console.error('Erro ao verificar nickname:', err);
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }

    if (results.length > 0) {
      // Se o jogador já existe, retorna um erro
      return res.status(400).json({ error: 'Nickname já existe' });
    }

    // Se o jogador não existe, insere o novo nickname
    const query = 'INSERT INTO scores (player_name, score) VALUES (?, ?)';
    connection.query(query, [playerName, score], (err, results) => {
      if (err) {
        console.error('Erro ao salvar nickname:', err);
        return res.status(500).json({ error: 'Erro no banco de dados' });
      }
      res.status(201).json({ id: results.insertId, playerName, score });
    });
  });
});

// Endpoint para obter todas as pontuações
app.get('/api/scores', (req, res) => {
  const query = 'SELECT * FROM scores ORDER BY score DESC';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar pontuações:', err);
      res.status(500).json({ error: 'Erro no banco de dados' });
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint para obter todos os usuários ativos
app.get('/api/active-users', (req, res) => {
  const query = 'SELECT player_name, score FROM scores ORDER BY score DESC';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários ativos:', err);
      res.status(500).json({ error: 'Erro no banco de dados' });
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint para atualizar a pontuação de um jogador
app.post('/api/update-score', (req, res) => {
  const { playerName, score } = req.body;
  const query = 'UPDATE scores SET score = ? WHERE player_name = ?';
  connection.query(query, [score, playerName], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar pontuação:', err);
      res.status(500).json({ error: 'Erro no banco de dados' });
      return;
    }
    res.status(200).json({ message: 'Pontuação atualizada com sucesso' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});