import React, { useEffect, useState } from "react";
import { fetchB3Stocks } from "../lib/b3stocks";
import { fetchQuotes } from "../lib/fetchers";

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function updateData() {
      setLoading(true);

      // Busca tickers válidos
      const stocksList = await fetchB3Stocks();
      setStocks(stocksList);

      // Busca cotações e volumes em tempo real
      const symbols = stocksList.map(stock => stock.symbol);
      const quotesList = await fetchQuotes(symbols);
      setQuotes(quotesList);

      setLoading(false);
      setLastUpdate(new Date());
    }

    updateData();
    interval = setInterval(updateData, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header>
        <span>
          Última atualização: {lastUpdate ? lastUpdate.toLocaleTimeString("pt-BR") : "Carregando..."}
        </span>
      </header>
      <main style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', color: '#F3F6F9', background: '#0d1117', minHeight: '100vh' }}>
  <h1 style={{ fontSize: 24, marginBottom: 24 }}>Triadex – Monitor em Tempo Real</h1>

  <div style={{ marginBottom: 36 }}>
    <strong>Última atualização:</strong> {lastUpdate ? lastUpdate.toLocaleTimeString("pt-BR") : "Carregando..."}
  </div>

  {loading && <div>Atualizando dados...</div>}

  <div style={{ display: 'flex', gap: 40 }}>
    <section style={{ flex: 1 }}>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>Ações encontradas</h2>
      <ul style={{ maxHeight: 320, overflow: 'auto', background: '#161b22', borderRadius: 8, padding: 12 }}>
        {stocks.length === 0 ? (
          <li>Nenhuma ação encontrada.</li>
        ) : (
          stocks.slice(0, 50).map(stock => (
            <li key={stock.symbol} style={{ padding: 2, borderBottom: '1px solid #232b3b33' }}>
              <span style={{ color: '#6C5DD3', fontWeight: 600 }}>{stock.symbol}</span> – {stock.name}
            </li>
          ))
        )}
      </ul>
    </section>

    <section style={{ flex: 2 }}>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>Cotações em tempo real (top 20 volumes)</h2>
      <ul style={{ background: '#161b22', borderRadius: 8, padding: 12 }}>
        {quotes.length === 0 ? (
          <li>Nenhuma cotação encontrada.</li>
        ) : (
          quotes
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 20)
            .map(q => (
              <li key={q.symbol} style={{ padding: 2, borderBottom: '1px solid #232b3b33' }}>
                <span style={{ color: '#00D395', fontWeight: 600 }}>{q.symbol}</span>: R$ {q.price} | Volume: {q.volume}
              </li>
            ))
        )}
      </ul>
    </section>
  </div>
</main>
