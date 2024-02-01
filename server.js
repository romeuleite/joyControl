const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json()); // Para parsear o corpo das requisições JSON

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'abc123',  
  port: 5432,
});

app.post('/save-coordinates', async (req, res) => {
  const { name, x, y, z } = req.body;
  const time = new Date(); // Gera o timestamp atual

  try {
    const queryText = 'INSERT INTO coordenadas(name, time, x, y, z) VALUES($1, $2, $3, $4, $5)';
    const queryValues = [name, time, x, y, z];
    await pool.query(queryText, queryValues);
    res.status(200).send('Coordenadas salvas com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar coordenadas', error);
    res.status(500).send('Erro ao salvar coordenadas');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});