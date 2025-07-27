
import { NextResponse } from "next/server";

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalSignal {
  ticker: string;
  price: number;
  high20: number;
  low20: number;
  high10: number;
  low10: number;
  atr: number;
  atrPercent: number;
  signal: "COMPRA" | "VENDA" | "LATERAL";
  entryPrice?: number;
  stopLoss?: number;
  targetPrice?: number;
  positionSize: number;
  riskReward: number;
  finalScore: "ALTA" | "LATERAL" | "QUEDA";
}

function calculateATR(prices: PriceData[], period = 20): number {
  if (prices.length < period + 1) return 0;
  const tr: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const high = prices[i].high;
    const low = prices[i].low;
    const prevClose = prices[i - 1].close;
    
    tr.push(Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    ));
  }
  
  const recentTR = tr.slice(-period);
  return recentTR.reduce((a, b) => a + b, 0) / recentTR.length;
}

function getHighLow(prices: PriceData[], period: number) {
  if (prices.length < period) return { high: 0, low: 0 };
  
  const recent = prices.slice(-period);
  return {
    high: Math.max(...recent.map(p => p.high)),
    low: Math.min(...recent.map(p => p.low)),
  };
}

function calculatePositionSize(capital: number, atr: number, price: number): number {
  const riskPerShare = 2 * atr;
  const capitalRisk = capital * 0.01; // 1% de risco do capital
  return Math.floor(capitalRisk / riskPerShare);
}

export async function POST(request: Request) {
  try {
    const { stockData, capital = 100000 } = await request.json();
    
    if (!Array.isArray(stockData)) {
      return NextResponse.json(
        { error: "stockData deve ser um array" },
        { status: 400 }
      );
    }
    
    const technicalSignals: TechnicalSignal[] = [];
    
    for (const stock of stockData) {
      const prices: PriceData[] = stock.priceHistory;
      
      if (!prices || prices.length === 0) {
        continue;
      }
      
      const currentPrice = prices[prices.length - 1].close;
      const atr = calculateATR(prices, 20);
      const atrPercent = (atr / currentPrice) * 100;
      
      const { high: high20, low: low20 } = getHighLow(prices, 20);
      const { high: high10, low: low10 } = getHighLow(prices, 10);

      let signal: "COMPRA" | "VENDA" | "LATERAL" = "LATERAL";
      let entryPrice: number | undefined;
      let stopLoss: number | undefined;
      let targetPrice: number | undefined;
      let positionSize = 0;
      let riskReward = 0;

      // Turtle Trading Strategy
      if (currentPrice > high20 && atrPercent > 1.5) {
        signal = "COMPRA";
        entryPrice = currentPrice;
        stopLoss = currentPrice - 2 * atr;
        targetPrice = currentPrice + 3 * atr;
        positionSize = calculatePositionSize(capital, atr, currentPrice);
        riskReward = (targetPrice - entryPrice) / (entryPrice - stopLoss);
      } else if (currentPrice < low20 && atrPercent > 1.5) {
        signal = "VENDA";
        entryPrice = currentPrice;
        stopLoss = currentPrice + 2 * atr;
        positionSize = 0; // Não calculamos posição para venda a descoberto
        riskReward = 0;
      }

      let finalScore: "ALTA" | "LATERAL" | "QUEDA";
      if (signal === "COMPRA" && riskReward > 1.5) {
        finalScore = "ALTA";
      } else if (signal === "VENDA") {
        finalScore = "QUEDA";
      } else {
        finalScore = "LATERAL";
      }

      technicalSignals.push({
        ticker: stock.ticker,
        price: Number(currentPrice.toFixed(2)),
        high20: Number(high20.toFixed(2)),
        low20: Number(low20.toFixed(2)),
        high10: Number(high10.toFixed(2)),
        low10: Number(low10.toFixed(2)),
        atr: Number(atr.toFixed(2)),
        atrPercent: Number(atrPercent.toFixed(2)),
        signal,
        entryPrice: entryPrice ? Number(entryPrice.toFixed(2)) : undefined,
        stopLoss: stopLoss ? Number(stopLoss.toFixed(2)) : undefined,
        targetPrice: targetPrice ? Number(targetPrice.toFixed(2)) : undefined,
        positionSize,
        riskReward: Number(riskReward.toFixed(2)),
        finalScore,
      });
    }
    
    return NextResponse.json({ signals: technicalSignals });
  } catch (error) {
    console.error('Error in technical analysis:', error);
    return NextResponse.json(
      { error: "Erro ao processar análise técnica" },
      { status: 500 }
    );
  }
}
