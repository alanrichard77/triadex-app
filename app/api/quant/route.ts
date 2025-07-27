
import { NextResponse } from "next/server";

interface PriceData {
  date: string;
  close: number;
  volume: number;
}

interface QuantSignal {
  ticker: string;
  momentum20: number;
  momentum60: number;
  momentum120: number;
  meanReversion: "ALTA" | "BAIXA" | "NEUTRO";
  volumeAnomaly: boolean;
  volatilityScore: number;
  sharpeRatio: number;
  winRate: number;
  finalScore: "ALTA" | "LATERAL" | "QUEDA";
  confidence: number;
}

function calculateMomentum(prices: PriceData[], days: number): number {
  if (prices.length < days) return 0;
  const current = prices[prices.length - 1].close;
  const past = prices[prices.length - days].close;
  return ((current - past) / past) * 100;
}

function calculateSharpe(returns: number[]): number {
  if (!returns.length) return 0;
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const std = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / returns.length);
  const riskFree = 10 / 252;
  return std === 0 ? 0 : (avg - riskFree) / std;
}

function detectVolumeAnomaly(volumes: number[]): boolean {
  if (volumes.length < 20) return false;
  const recent = volumes[volumes.length - 1];
  const avg = volumes.slice(-20, -1).reduce((a, b) => a + b, 0) / 19;
  const std = Math.sqrt(volumes.slice(-20, -1).reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 19);
  return recent > avg + 2 * std;
}

function calculateMeanReversion(prices: PriceData[]): "ALTA" | "BAIXA" | "NEUTRO" {
  if (prices.length < 50) return "NEUTRO";
  const current = prices[prices.length - 1].close;
  const ma20 = prices.slice(-20).reduce((s, p) => s + p.close, 0) / 20;
  const ma50 = prices.slice(-50).reduce((s, p) => s + p.close, 0) / 50;
  if (current > ma20 && ma20 < ma50) return "ALTA";
  if (current < ma20 && ma20 > ma50) return "BAIXA";
  return "NEUTRO";
}

function calculateWinRate(prices: PriceData[]): number {
  if (prices.length < 60) return 50;
  let wins = 0, total = 0;
  for (let i = 40; i < prices.length - 20; i++) {
    const momentum = calculateMomentum(prices.slice(0, i), 20);
    if (Math.abs(momentum) > 5) {
      total++;
      const futRet = ((prices[i + 20].close - prices[i].close) / prices[i].close) * 100;
      if ((momentum > 0 && futRet > 0) || (momentum < 0 && futRet < 0)) wins++;
    }
  }
  return total ? (wins / total) * 100 : 50;
}

export async function POST(request: Request) {
  try {
    const { stockData } = await request.json();
    
    if (!Array.isArray(stockData)) {
      return NextResponse.json(
        { error: "stockData deve ser um array" },
        { status: 400 }
      );
    }
    
    const quantSignals: QuantSignal[] = [];
    
    for (const stock of stockData) {
      const prices: PriceData[] = stock.priceHistory;
      
      if (!prices || prices.length === 0) {
        continue;
      }
      
      const momentum20 = calculateMomentum(prices, 20);
      const momentum60 = calculateMomentum(prices, 60);
      const momentum120 = calculateMomentum(prices, 120);
      
      const returns = prices.slice(1).map((p, i) => ((p.close - prices[i].close) / prices[i].close) * 100);
      const sharpeRatio = calculateSharpe(returns);
      const winRate = calculateWinRate(prices);
      const meanReversion = calculateMeanReversion(prices);
      const volumeAnomaly = detectVolumeAnomaly(prices.map(p => p.volume));
      
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const volatilityScore = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length);

      let pos = 0, neg = 0;
      if (momentum20 > 0 && momentum60 > 0) pos++;
      if (momentum20 < -5 || momentum60 < -10) neg++;
      if (sharpeRatio > 1 && winRate > 52) pos++;
      if (sharpeRatio < 0 || winRate < 45) neg++;
      if (meanReversion === "ALTA") pos++;
      if (meanReversion === "BAIXA") neg++;
      if (volumeAnomaly) pos++;

      let finalScore: "ALTA" | "LATERAL" | "QUEDA";
      let confidence: number;
      if (pos >= 2 && neg === 0) { 
        finalScore = "ALTA"; 
        confidence = Math.min(95, 60 + pos * 15); 
      } else if (neg >= 2 && pos === 0) { 
        finalScore = "QUEDA"; 
        confidence = Math.min(95, 60 + neg * 15); 
      } else { 
        finalScore = "LATERAL"; 
        confidence = 50 + Math.abs(pos - neg) * 10; 
      }

      quantSignals.push({
        ticker: stock.ticker,
        momentum20: Number(momentum20.toFixed(2)),
        momentum60: Number(momentum60.toFixed(2)),
        momentum120: Number(momentum120.toFixed(2)),
        meanReversion,
        volumeAnomaly,
        volatilityScore: Number(volatilityScore.toFixed(2)),
        sharpeRatio: Number(sharpeRatio.toFixed(2)),
        winRate: Number(winRate.toFixed(1)),
        finalScore,
        confidence: Number(confidence.toFixed(1)),
      });
    }
    
    return NextResponse.json({ signals: quantSignals });
  } catch (error) {
    console.error('Error in quant analysis:', error);
    return NextResponse.json(
      { error: "Erro ao processar análise quantitativa" },
      { status: 500 }
    );
  }
}
