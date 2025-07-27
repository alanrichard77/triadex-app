import axios from "axios";

export interface StockInfo {
  symbol: string;
  name: string;
  type: string;
  volume: number;
}

export async function fetchB3Stocks(): Promise<StockInfo[]> {
  try {
    // Faz uma busca avançada por todas as ações ativas na B3 via StatusInvest
    const { data } = await axios.post(
      "https://statusinvest.com.br/acao/busca-avancada",
      {
        setores: [],
        subsetores: [],
        segmentos: [],
        onlyativos: true,
        pagina: 1,
        tamanho: 2000
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return data.map((item: any) => ({
      symbol: item.ticker,
      name: item.empresa,
      type: item.tipo,
      volume: 0
    }));
  } catch (err) {
    console.error("Erro ao buscar tickers B3:", err);
    return [];
  }
}
