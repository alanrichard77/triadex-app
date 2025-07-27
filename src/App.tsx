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
      <main>
        {loading && <div>Atualizando dados...</div>}
        {/* Passe stocks e quotes para seus componentes de listagem/tabela */}
      </main>
    </div>
  );
}
