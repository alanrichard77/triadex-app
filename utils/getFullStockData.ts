
import { fetchStockQuotes, fetchStockHistory, generateMockFundamentals, StockQuote, HistoricalData } from '@/lib/fetchers';

export interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FundamentalData {
  revenue: number;
  netIncome: number;
  totalDebt: number;
  cash: number;
  shares: number;
  roe: number;
  pe: number;
  evEbitda: number;
  pvp: number;
}

export interface FullStockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  priceHistory: PriceData[];
  fundamentals: FundamentalData;
}

function formatHistoricalData(historical: HistoricalData[]): PriceData[] {
  return historical.map(item => ({
    date: new Date(item.date * 1000).toISOString().split('T')[0],
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
  }));
}

export async function getFullStockData(tickers: string[]): Promise<FullStockData[]> {
  try {
    console.log(`Fetching data for ${tickers.length} stocks...`);
    
    // Buscar cotações atuais
    const quotes = await fetchStockQuotes(tickers);
    console.log(`Received ${quotes.length} quotes`);
    
    const fullData: FullStockData[] = [];
    
    // Para cada ação, buscar histórico e dados fundamentalistas
    for (const quote of quotes) {
      try {
        // Buscar histórico
        const historical = await fetchStockHistory(quote.symbol);
        const priceHistory = formatHistoricalData(historical);
        
        // Gerar dados fundamentalistas mock
        const fundamentals = generateMockFundamentals(quote.symbol);
        
        const stockData: FullStockData = {
          ticker: quote.symbol,
          name: quote.shortName || quote.longName || quote.symbol,
          price: quote.regularMarketPrice || 0,
          change: quote.regularMarketChange || 0,
          changePercent: quote.regularMarketChangePercent || 0,
          volume: quote.regularMarketVolume || 0,
          marketCap: quote.marketCap || 0,
          priceHistory,
          fundamentals,
        };
        
        fullData.push(stockData);
        console.log(`Processed ${quote.symbol}: ${priceHistory.length} price points`);
        
        // Delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing ${quote.symbol}:`, error);
      }
    }
    
    console.log(`Successfully processed ${fullData.length} stocks`);
    return fullData;
  } catch (error) {
    console.error('Error in getFullStockData:', error);
    return [];
  }
}

// Função auxiliar para gerar dados mock para desenvolvimento
export function generateMockStockData(tickers: string[]): FullStockData[] {
  return tickers.map(ticker => {
    const seed = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const basePrice = 10 + (seed % 100);
    
    // Gerar histórico mock
    const priceHistory: PriceData[] = [];
    let currentPrice = basePrice;
    
    for (let i = 252; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const change = (Math.random() - 0.5) * 0.1; // ±5% max change
      currentPrice *= (1 + change);
      
      const dayRange = currentPrice * 0.03; // 3% intraday range
      const high = currentPrice + dayRange * Math.random();
      const low = currentPrice - dayRange * Math.random();
      const open = low + (high - low) * Math.random();
      const close = low + (high - low) * Math.random();
      
      priceHistory.push({
        date: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(1000000 + Math.random() * 10000000),
      });
    }
    
    const lastPrice = priceHistory[priceHistory.length - 1]?.close || basePrice;
    const prevPrice = priceHistory[priceHistory.length - 2]?.close || basePrice;
    
    return {
      ticker,
      name: `${ticker.slice(0, -1)} S.A.`,
      price: lastPrice,
      change: lastPrice - prevPrice,
      changePercent: ((lastPrice - prevPrice) / prevPrice) * 100,
      volume: Math.floor(1000000 + Math.random() * 10000000),
      marketCap: Math.floor(lastPrice * (1000000 + Math.random() * 100000000)),
      priceHistory,
      fundamentals: generateMockFundamentals(ticker),
    };
  });
}
