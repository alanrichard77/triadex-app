// lib/fetchers.ts
import axios from "axios";
import { StockInfo } from "./b3stocks";

export interface QuoteInfo {
  symbol: string;
  price: number;
  volume: number;
  currency: string;
  time: string;
}

// Usa BRAPI.dev para buscar cotações/volume em tempo real
export async function fetchQuotes(symbols: string[]): Promise<QuoteInfo[]> {
  const results: QuoteInfo[] = [];
  for (const symbol of symbols) {
    try {
      const response = await axios.get(`https://brapi.dev/api/quote/${symbol}`);
      const quote = response.data.results[0];
      results.push({
        symbol: quote.symbol,
        price: quote.regularMarketPrice,
        volume: quote.regularMarketVolume,
        currency: quote.currency,
        time: quote.regularMarketTime
      });
    } catch (err) {
      console.error(`Erro ao buscar cotação de ${symbol}`, err);
    }
  }
  return results;
}
