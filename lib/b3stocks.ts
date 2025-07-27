// lib/b3stocks.ts
import axios from 'axios';

export interface StockInfo {
  symbol: string;
  name: string;
  type: string;
  volume: number;
}

export async function fetchB3Stocks(): Promise<StockInfo[]> {
  // Exemplo usando CSV público da B3 com ativos negociados
  // (você pode trocar para scraping se preferir fonte HTML)
  const url = "https://sistemaswebb3-listados.b3.com.br/listedCompaniesPage/main/negociacoes.csv";
  try {
    const { data } = await axios.get(url);
    const rows = data.split('\n').slice(1); // remove header
    const stocks = rows
      .map((line: string) => {
        const [symbol, name, type] = line.split(';');
        return {
          symbol: symbol?.trim(),
          name: name?.trim(),
          type: type?.trim(),
          volume: 0 // Placeholder, será preenchido depois
        };
      })
      .filter(stock => stock.symbol && stock.symbol.endsWith('3') || stock.symbol.endsWith('4'));
    return stocks;
  } catch (err) {
    console.error("Erro ao buscar tickers B3:", err);
    return [];
  }
}
