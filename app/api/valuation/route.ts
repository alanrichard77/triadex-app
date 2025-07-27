
import { NextResponse } from "next/server";

interface FundamentalData {
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

interface ValuationResult {
  ticker: string;
  marketPrice: number;
  fairValue: number;
  discount: number;
  wacc: number;
  terminalGrowth: number;
  fcfGrowth5y: number;
  debtToEquity: number;
  roe: number;
  pe: number;
  evEbitda: number;
  pvp: number;
  finalScore: "BARATO" | "JUSTO" | "CARO";
  confidence: number;
}

function calculateWACC(
  riskFreeRate = 0.105,
  marketRiskPremium = 0.06,
  beta = 1.2,
  taxRate = 0.34,
  debtToEquity = 0.3
): number {
  const costOfEquity = riskFreeRate + beta * marketRiskPremium;
  const costOfDebt = riskFreeRate + 0.03;
  const equityWeight = 1 / (1 + debtToEquity);
  const debtWeight = debtToEquity / (1 + debtToEquity);
  
  return costOfEquity * equityWeight + costOfDebt * (1 - taxRate) * debtWeight;
}

function projectFCF(
  currentRevenue: number,
  currentNetIncome: number,
  revenueGrowthRates: number[],
  netMargin = 0.15
): number[] {
  const fcfProjections: number[] = [];
  let revenue = currentRevenue;
  
  for (let i = 0; i < 5; i++) {
    revenue *= 1 + revenueGrowthRates[i];
    const netIncome = revenue * netMargin;
    const fcf = netIncome * 0.8; // FCF = 80% do lucro líquido
    fcfProjections.push(fcf);
  }
  
  return fcfProjections;
}

function calculatePresentValue(
  fcfProjections: number[],
  wacc: number,
  terminalGrowth = 0.025
) {
  let presentValue = 0;
  
  // Valor presente dos FCFs projetados
  for (let i = 0; i < fcfProjections.length; i++) {
    presentValue += fcfProjections[i] / Math.pow(1 + wacc, i + 1);
  }
  
  // Valor terminal
  const terminalFCF = fcfProjections[4] * (1 + terminalGrowth);
  const terminalValue = terminalFCF / (wacc - terminalGrowth);
  const terminalPV = terminalValue / Math.pow(1 + wacc, 5);
  
  return { pv: presentValue + terminalPV, terminalValue: terminalPV };
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
    
    const valuationResults: ValuationResult[] = [];
    
    for (const stock of stockData) {
      const fundamentals: FundamentalData = stock.fundamentals;
      const marketPrice = stock.price;
      
      if (!fundamentals || !marketPrice) {
        continue;
      }
      
      // Calcular debt-to-equity
      const debtToEquity = fundamentals.totalDebt / (fundamentals.shares * marketPrice);
      
      // Calcular WACC
      const wacc = calculateWACC(0.105, 0.06, 1.2, 0.34, debtToEquity);
      
      // Projeções de crescimento da receita
      const revenueGrowthRates = [0.12, 0.1, 0.08, 0.06, 0.04];
      
      // Projetar FCF
      const fcfProjections = projectFCF(
        fundamentals.revenue,
        fundamentals.netIncome,
        revenueGrowthRates,
        fundamentals.netIncome / fundamentals.revenue
      );
      
      // Calcular valor presente
      const terminalGrowth = 0.025;
      const { pv: firmValue } = calculatePresentValue(fcfProjections, wacc, terminalGrowth);
      
      // Valor do patrimônio líquido
      const netDebt = fundamentals.totalDebt - (fundamentals.cash ?? 0);
      const equityValue = firmValue - netDebt;
      const fairValue = equityValue / fundamentals.shares;
      
      // Calcular desconto/prêmio
      const discount = ((marketPrice - fairValue) / fairValue) * 100;
      
      // Determinar score final
      let finalScore: "BARATO" | "JUSTO" | "CARO";
      let confidence: number;
      
      if (discount < -20 && fundamentals.roe > 10 && fundamentals.pe > 0) {
        finalScore = "BARATO";
        confidence = Math.min(95, 70 + Math.abs(discount));
      } else if (discount > 10 || fundamentals.roe < 5 || fundamentals.pe < 0) {
        finalScore = "CARO";
        confidence = Math.min(95, 70 + Math.abs(discount));
      } else {
        finalScore = "JUSTO";
        confidence = 60 + Math.random() * 20;
      }
      
      // Crescimento FCF 5 anos
      const fcfGrowth5y = (Math.pow(fcfProjections[4] / fcfProjections[0], 1 / 4) - 1) * 100;
      
      valuationResults.push({
        ticker: stock.ticker,
        marketPrice: Number(marketPrice.toFixed(2)),
        fairValue: Number(fairValue.toFixed(2)),
        discount: Number(discount.toFixed(1)),
        wacc: Number((wacc * 100).toFixed(2)),
        terminalGrowth: Number((terminalGrowth * 100).toFixed(2)),
        fcfGrowth5y: Number(fcfGrowth5y.toFixed(1)),
        debtToEquity: Number(debtToEquity.toFixed(2)),
        roe: Number(fundamentals.roe.toFixed(1)),
        pe: Number(fundamentals.pe.toFixed(1)),
        evEbitda: Number(fundamentals.evEbitda.toFixed(1)),
        pvp: Number(fundamentals.pvp.toFixed(2)),
        finalScore,
        confidence: Number(confidence.toFixed(1)),
      });
    }
    
    return NextResponse.json({ valuations: valuationResults });
  } catch (error) {
    console.error('Error in valuation analysis:', error);
    return NextResponse.json(
      { error: "Erro ao processar análise de valuation" },
      { status: 500 }
    );
  }
}
