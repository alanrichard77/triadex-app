// lib/b3stocks.ts
import axios from 'axios';

export interface StockInfo {
  symbol: string;
  name: string;
  type: string;
  volume: number;
}

export async function fetchB3Stocks(): Promise<StockInfo[]> {
  // Fonte de tickers B3 (StatusInvest scrape simples ou CSV oficial)
  // Exemplo usando o StatusInvest para garantir tickers válidos
  const url = "https://statusinvest.com.br/acoes/buscaavancada";
  try {
    const { data } = await axios.post(url, {
      segmentos: [],
      setores: [],
      subsetores: [],
      onlyativos: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // O StatusInvest retorna lista já filtrada
    return data.map((item: any) => ({
      symbol: item.ticker,
      name: item.nome,
      type: item.tipo,
      volume: 0 // Preenche depois ao juntar com cotação
    }));
  } catch (err) {
    console.error("Erro ao buscar tickers B3:", err);
    return [];
  }
}
