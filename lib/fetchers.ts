import axios from "axios";

export interface QuoteInfo {
  symbol: string;
  price: number;
  volume: number;
  currency: string;
  time: string;
}

export async function fetchQuotes(symbols: string[]): Promise<QuoteInfo[]> {
  if (!symbols.length) return [];
  // Limita para não estourar a API, pode paginar depois se quiser mais de 100
  const batch = symbols.slice(0, 100).join(",");

  try {
    const url = `https://brapi.dev/api/quote/${batch}?range=1d&fundamental=true`;
    const { data } = await axios.get(url);
    return (data.results || []).map((q: any) => ({
      symbol: q.symbol,
      price: q.regularMarketPrice,
      volume: q.regularMarketVolume,
      currency: q.currency,
      time: q.regularMarketTime
    }));
  } catch (err) {
    console.error("Erro ao buscar cotações:", err);
    return [];
  }
}
