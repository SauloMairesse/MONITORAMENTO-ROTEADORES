// backend-monitoramento/index.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const ping = require('ping');

const app = express();
const PORT = 3001;

app.use(cors());

// Rota principal retorna lista de roteadores (sem status)
app.get('/api/routers', (req, res) => {
  const path = require('path');
  const filePath = path.join(__dirname, 'data', 'routersData.json');
  const data = fs.readFileSync(filePath);
  const routers = JSON.parse(data);
  res.json(routers);
});

// Rota para verificar status dinâmico
app.get('/api/ping/:ip', async (req, res) => {
  const ip = req.params.ip;

  try {
    const result = await ping.promise.probe(ip, { timeout: 2 });
    res.json({ ativo: result.alive });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer ping no roteador.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend ouvindo na porta ${PORT}`);
});