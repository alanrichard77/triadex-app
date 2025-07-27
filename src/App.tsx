import React from "react";

export default function App() {
  return (
    <main style={{
      padding: 24,
      fontFamily: 'Inter, Arial, sans-serif',
      color: '#F3F6F9',
      background: '#0d1117',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Triadex – Monitor em Tempo Real</h1>

      <div style={{ marginBottom: 36 }}>
        <strong>Última atualização:</strong> 14:52:00
      </div>

      <div>Atualizando dados...</div>

      <div style={{ display: 'flex', gap: 40 }}>
        <section style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Ações encontradas</h2>
          <ul style={{ maxHeight: 320, overflow: 'auto', background: '#161b22', borderRadius: 8, padding: 12 }}>
            <li>
              <span style={{ color: '#6C5DD3', fontWeight: 600 }}>VALE3</span> – Vale S.A.
            </li>
            <li>
              <span style={{ color: '#6C5DD3', fontWeight: 600 }}>PETR4</span> – Petrobras PN
            </li>
          </ul>
        </section>

        <section style={{ flex: 2 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Cotações em tempo real (top 2 volumes)</h2>
          <ul style={{ background: '#161b22', borderRadius: 8, padding: 12 }}>
            <li>
              <span style={{ color: '#00D395', fontWeight: 600 }}>VALE3</span>: R$ 62,33 | Volume: 10.000.000
            </li>
            <li>
              <span style={{ color: '#00D395', fontWeight: 600 }}>PETR4
