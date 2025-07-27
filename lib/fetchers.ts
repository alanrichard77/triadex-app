
// Funções para buscar dados da API brapi.dev
export interface StockQuote {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketDayRange: string;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: string;
  marketCap: number;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  averageDailyVolume10Day: number;
  averageDailyVolume3Month: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  priceEarnings: number;
  earningsPerShare: number;
  logoUrl: string;
}

export interface HistoricalData {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

export interface StockHistory {
  symbol: string;
  historical: HistoricalData[];
}

const BRAPI_BASE_URL = "https://brapi.dev/api";

export async function fetchStockQuotes(tickers: string[]): Promise<StockQuote[]> {
  try {
    const tickerString = tickers.join(',');
    const response = await fetch(`${BRAPI_BASE_URL}/quote/${tickerString}?token=demo`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching stock quotes:', error);
    return [];
  }
}

export async function fetchStockHistory(ticker: string, interval: string = '1d', range: string = '1y'): Promise<HistoricalData[]> {
  try {
    const response = await fetch(`${BRAPI_BASE_URL}/quote/${ticker}/history?interval=${interval}&range=${range}&token=demo`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results?.[0]?.historical || [];
  } catch (error) {
    console.error(`Error fetching history for ${ticker}:`, error);
    return [];
  }
}

export async function fetchMultipleStockHistory(tickers: string[], interval: string = '1d', range: string = '1y'): Promise<Record<string, HistoricalData[]>> {
  const results: Record<string, HistoricalData[]> = {};
  
  // Processa em lotes para evitar rate limiting
  const batchSize = 5;
  for (let i = 0; i < tickers.length; i += batchSize) {
    const batch = tickers.slice(i, i + batchSize);
    const promises = batch.map(ticker => fetchStockHistory(ticker, interval, range));
    const histories = await Promise.all(promises);
    
    batch.forEach((ticker, index) => {
      results[ticker] = histories[index];
    });
    
    // Delay entre lotes
    if (i + batchSize < tickers.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Função para simular dados fundamentalistas (mock data)
export function generateMockFundamentals(ticker: string) {
  const seed = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min: number, max: number) => min + (seed % (max - min));
  
  return {
    revenue: random(1000000, 50000000),
    netIncome: random(50000, 5000000),
    totalDebt: random(100000, 10000000),
    cash: random(50000, 5000000),
    shares: random(1000000, 1000000000),
    roe: random(5, 25),
    pe: random(8, 30),
    evEbitda: random(5, 20),
    pvp: random(0.5, 5),
  };
}
