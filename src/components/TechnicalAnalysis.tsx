
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TechnicalData {
  ticker: string;
  name: string;
  price: number;
  signal: string;
  atr: number;
  entryPrice?: number;
  stopLoss?: number;
  targetPrice?: number;
  riskReward: number;
  finalScore: string;
}

interface TechnicalAnalysisProps {
  data: TechnicalData[];
}

export function TechnicalAnalysis({ data }: TechnicalAnalysisProps) {
  const getSignalBadge = (signal: string) => {
    const signalMap = {
      'COMPRA': { color: 'bg-green-500', icon: <TrendingUp className="w-3 h-3" /> },
      'VENDA': { color: 'bg-red-500', icon: <TrendingDown className="w-3 h-3" /> },
      'LATERAL': { color: 'bg-yellow-500', icon: <Minus className="w-3 h-3" /> },
    };

    const config = signalMap[signal as keyof typeof signalMap] || { color: 'bg-gray-500', icon: <Minus className="w-3 h-3" /> };
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {config.icon}
        {signal}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 bg-slate-800/50">
            <TableHead className="text-slate-300">Ação</TableHead>
            <TableHead className="text-slate-300 text-right">Preço</TableHead>
            <TableHead className="text-slate-300 text-center">Sinal</TableHead>
            <TableHead className="text-slate-300 text-right">ATR</TableHead>
            <TableHead className="text-slate-300 text-right">Entrada</TableHead>
            <TableHead className="text-slate-300 text-right">Stop Loss</TableHead>
            <TableHead className="text-slate-300 text-right">Alvo</TableHead>
            <TableHead className="text-slate-300 text-right">R:R</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stock) => (
            <TableRow key={stock.ticker} className="border-slate-700 bg-slate-900/50 hover:bg-slate-800/50">
              <TableCell>
                <div>
                  <div className="font-medium text-white">{stock.ticker}</div>
                  <div className="text-sm text-slate-400">{stock.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-right text-white font-medium">
                {formatCurrency(stock.price)}
              </TableCell>
              <TableCell className="text-center">
                {getSignalBadge(stock.signal)}
              </TableCell>
              <TableCell className="text-right text-slate-300">{formatCurrency(stock.atr)}</TableCell>
              <TableCell className="text-right text-slate-300">
                {stock.entryPrice ? formatCurrency(stock.entryPrice) : '-'}
              </TableCell>
              <TableCell className="text-right text-slate-300">
                {stock.stopLoss ? formatCurrency(stock.stopLoss) : '-'}
              </TableCell>
              <TableCell className="text-right text-slate-300">
                {stock.targetPrice ? formatCurrency(stock.targetPrice) : '-'}
              </TableCell>
              <TableCell className="text-right text-slate-300">
                {stock.riskReward > 0 ? `1:${stock.riskReward.toFixed(1)}` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
