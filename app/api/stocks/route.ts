
import { NextResponse } from "next/server";
import { B3_STOCKS, getStockBatch } from "@/lib/b3stocks";
import { getFullStockData, generateMockStockData } from "@/utils/getFullStockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const mock = searchParams.get('mock') === 'true';
    
    // Selecionar lote de ações
    const stockBatch = getStockBatch(offset, limit);
    
    let stockData;
    if (mock) {
      // Usar dados mock para desenvolvimento
      stockData = generateMockStockData(stockBatch);
    } else {
      // Buscar dados reais da API
      stockData = await getFullStockData(stockBatch);
    }
    
    return NextResponse.json({
      stocks: stockData,
      total: B3_STOCKS.length,
      limit,
      offset,
      hasMore: offset + limit < B3_STOCKS.length,
    });
  } catch (error) {
    console.error('Error in stocks API:', error);
    return NextResponse.json(
      { error: "Erro ao buscar dados das ações" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { tickers, mock = false } = await request.json();
    
    if (!Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: "Lista de tickers é obrigatória" },
        { status: 400 }
      );
    }
    
    let stockData;
    if (mock) {
      stockData = generateMockStockData(tickers);
    } else {
      stockData = await getFullStockData(tickers);
    }
    
    return NextResponse.json({ stocks: stockData });
  } catch (error) {
    console.error('Error in stocks POST API:', error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
