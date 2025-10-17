import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

function RouterTable() {
  const [routers, setRouters] = useState([]);

  useEffect(() => {
    // Primeiro busca os dados base
    axios.get('http://localhost:3001/api/routers')
      .then(res => {
        const routersComStatusInicial = res.data.map(router => ({ ...router}));
        setRouters(routersComStatusInicial);
      })
      .catch(err => console.error("ERRO REQUEST BACKEND", err));
    }, []);

  return (
    <Container>
      <Title>Monitoramento de Roteadores</Title>
      <Table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Bloco</th>
            <th>Sala</th>
            <th>IP WAN</th>
            <th>Config</th>
            <th>Master</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {routers.map((router, index) => (
            <tr key={index}>
              <td>{router.modelo}</td>
              <td>{router.bloco}</td>
              <td>{router.local}</td>
              <td>
                <a href={`http://${router.ipWan}`} target="_blank" rel="noopener noreferrer">
                  {router.ipWan}
                </a>
              </td>
              <td>{router.configuracao}</td>
              <td>{router.roteadorMaster}</td>
              <td>
                {router.status === null ? (
                  <StatusBadge aguardando>Aguardando...</StatusBadge>
                ) : (
                  <StatusBadge ativo={router.status}>
                    {router.status}
                  </StatusBadge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 10px;
  color: white;
  font-size: 0.9em;
  background-color: ${({ ativo, aguardando }) => 
    aguardando ? '#9e9e9e' : ativo ? '#4caf50' : '#f44336'};
`;

export default RouterTable;
