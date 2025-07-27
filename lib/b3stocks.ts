
// Lista das 50 ações mais líquidas da B3 (atualizada 2025)
export const B3_STOCKS = [
  // Blue Chips - Maior liquidez
  "PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "BBAS3", "WEGE3", "SUZB3", "RENT3", "LREN3",
  "MGLU3", "VBBR3", "ITSA4", "PETR3", "BBDC3", "RAIL3", "USIM5", "CSNA3", "GOAU4", "BEEF3",
  "JBSS3", "BRFS3", "MRFG3", "CCRO3", "CIEL3", "HYPE3", "RADL3", "RAIA3", "PCAR3", "ASAI3",
  
  // Setor Financeiro
  "SANB11", "BPAC11", "PINE4", "BMGB4", "BAZA3", "BPAN4", "CARD3", "CSAN3", "WIZS3", "BANC3",
  
  // Outros setores importantes
  "BRAV3", "PRIO3", "RECR3", "GGBR4", "USIM3", "KLBN11", "EGIE3", "CMIG4", "CPFE3", "ELET3"
];

export const getStockBatch = (startIndex: number, batchSize: number = 50): string[] => {
  return B3_STOCKS.slice(startIndex, startIndex + batchSize);
};

export const getTotalStocks = (): number => B3_STOCKS.length;

export const isValidStock = (ticker: string): boolean => {
  return B3_STOCKS.includes(ticker.toUpperCase());
};
