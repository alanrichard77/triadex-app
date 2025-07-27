// src/App.tsx
import React, { useEffect, useState } from "react";
import { fetchB3Stocks } from "../lib/b3stocks";
import { fetchQuotes } from "../lib/fetchers";

export default function App() {
  const [stocks, setStocks] = useState([]);    // Universo de ações da B3
  const [quotes, setQuotes] = useState([]);    // Cotações em tempo real
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function updateData() {
      setLoading(true);

      // Busca os tickers atualizados (limpa os mortos automaticamente)
      const stocksList = await fetchB3Stocks();
      setStocks(stocksList);

      // Busca as cotações em tempo real para os tickers válidos
      const symbols = stocksList.map(stock => stock.symbol);
      const quotesList = await fetchQuotes(symbols);
      setQuotes(quotesList);

      setLoading(false);
      setLastUpdate(new Date());
    }

    // Busca inicial
    updateData();

    // Atualiza a cada 1 minuto
    interval = setInterval(updateData, 60 * 1000);

    // Limpa o timer ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header>
        {/* Seu header padrão */}
        <span>
          Última atualização: {lastUpdate ? lastUpdate.toLocaleTimeString("pt-BR") : "Carregando..."}
        </span>
      </header>
      <main>
        {/* Passe os dados para seus componentes/tabelas */}
        {loading && <div>Atualizando dados...</div>}
        {/* Exemplo: <ScannerTable stocks={stocks} quotes={quotes} /> */}
      </main>
    </div>
  );
}
