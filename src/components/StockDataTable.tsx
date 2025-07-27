
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StockData {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  variation: number;
  volume: string;
  quantScore: string;
  technicalScore: string;
  valuationScore: string;
  finalScore: string;
  confidence: number;
  target?: number;
  stopLoss?: number;
}

interface StockDataTableProps {
  data: StockData[];
}

export function StockDataTable({ data }: StockDataTableProps) {
  const getScoreBadge = (score: string) => {
    const scoreMap = {
      'OPORTUNIDADE': { color: 'bg-blue-500', icon: <TrendingUp className="w-3 h-3" /> },
      'ALTA': { color: 'bg-green-500', icon: <TrendingUp className="w-3 h-3" /> },
      'BARATO': { color: 'bg-green-500', icon: <TrendingUp className="w-3 h-3" /> },
      'LATERAL': { color: 'bg-yellow-500', icon: <Minus className="w-3 h-3" /> },
      'JUSTO': { color: 'bg-yellow-500', icon: <Minus className="w-3 h-3" /> },
      'QUEDA': { color: 'bg-red-500', icon: <TrendingDown className="w-3 h-3" /> },
      'CARO': { color: 'bg-red-500', icon: <TrendingDown className="w-3 h-3" /> },
    };

    const config = scoreMap[score as keyof typeof scoreMap] || { color: 'bg-gray-500', icon: <Minus className="w-3 h-3" /> };
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {config.icon}
        {score}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatVariation = (variation: number) => {
    const sign = variation >= 0 ? '+' : '';
    const color = variation >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <span className={color}>
        {sign}{variation.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 bg-slate-800/50">
            <TableHead className="text-slate-300">Ação</TableHead>
            <TableHead className="text-slate-300">Setor</TableHead>
            <TableHead className="text-slate-300 text-right">Preço</TableHead>
            <TableHead className="text-slate-300 text-right">Variação</TableHead>
            <TableHead className="text-slate-300 text-right">Volume</TableHead>
            <TableHead className="text-slate-300 text-center">Quant</TableHead>
            <TableHead className="text-slate-300 text-center">Técnico</TableHead>
            <TableHead className="text-slate-300 text-center">Valuation</TableHead>
            <TableHead className="text-slate-300 text-center">Final</TableHead>
            <TableHead className="text-slate-300 text-center">Confiança</TableHead>
            <TableHead className="text-slate-300 text-right">Alvo</TableHead>
            <TableHead className="text-slate-300 text-right">Stop</TableHead>
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
              <TableCell className="text-slate-300">{stock.sector}</TableCell>
              <TableCell className="text-right text-white font-medium">
                {formatCurrency(stock.price)}
              </TableCell>
              <TableCell className="text-right">
                {formatVariation(stock.variation)}
              </TableCell>
              <TableCell className="text-right text-slate-300">{stock.volume}</TableCell>
              <TableCell className="text-center">
                {getScoreBadge(stock.quantScore)}
              </TableCell>
              <TableCell className="text-center">
                {getScoreBadge(stock.technicalScore)}
              </TableCell>
              <TableCell className="text-center">
                {getScoreBadge(stock.valuationScore)}
              </TableCell>
              <TableCell className="text-center">
                {getScoreBadge(stock.finalScore)}
              </TableCell>
              <TableCell className="text-center">
                <span className="text-slate-300">{stock.confidence}%</span>
              </TableCell>
              <TableCell className="text-right text-slate-300">
                {stock.target ? formatCurrency(stock.target) : '-'}
              </TableCell>
              <TableCell className="text-right text-slate-300">
                {stock.stopLoss ? formatCurrency(stock.stopLoss) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
