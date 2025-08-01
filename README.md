# Sistema de Monitoramento de Roteadores

Este projeto consiste em um sistema simples de monitoramento de roteadores para redes WiFi, com backend em Node.js e frontend em React.

## Funcionalidades

- Leitura de dados de roteadores a partir de um arquivo JSON
- Ping dinâmico aos IPs WAN para verificar se os dispositivos estão ativos
- Atualização da tabela de status a cada 10 minutos
- Interface web para visualização dos dados dos roteadores

## Scripts Adicionais

Inclui também um script bash para monitoramento contínuo de conectividade (ping) com geração de logs CSV, TXT e saída bruta.

## Como executar

1. Instale as dependências do backend e frontend (`npm install`)
2. Inicie o backend: `npm run dev`
3. Inicie o frontend: `npm start`
4. (Opcional) Execute o script de monitoramento em um ambiente Linux

## Autor

Saulo Mairesse – Projeto do GREDES no IFTO Palmas
