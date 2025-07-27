import axios from "axios";

export interface StockInfo {
  symbol: string;
  name: string;
  type: string;
  volume: number;
}

export async function fetchB3Stocks(): Promise<StockInfo[]> {
  try {
    // Busca todas as ações ativas da B3 usando a API da StatusInvest
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
    // Se precisar ajustar os campos, veja pelo console.log(data)
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
