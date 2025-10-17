// backend-monitoramento/index.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const ping = require('ping');

const app = express();
const PORT = 3001;

app.use(cors());

const filePath = require('path').join(__dirname, 'data', 'routersData.json');

async function obterStatus(router) {
  try {
    const resultadoPing = await ping.promise.probe(router.ipWan, { timeout: 2 });
    return { ...router, ativo: resultadoPing.alive };
  } catch {
    return { ...router, ativo: false };
  }
}

// Rota principal retorna lista de roteadores e busca o status deles
app.get('/api/routers', async (req, res) => {
  const data = fs.readFileSync(filePath);
  const routers = JSON.parse(data);

  const routers_status_atualizados = obterStatus(routers);

  res.send(routers_status_atualizados)
});

app.listen(PORT, () => {
  console.log(`Servidor backend ouvindo na porta ${PORT}`);
});
