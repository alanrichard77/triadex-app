
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuantData {
  ticker: string;
  name: string;
  momentum20: number;
  momentum60: number;
  meanReversion: string;
  sharpeRatio: number;
  winRate: number;
  finalScore: string;
  confidence: number;
}

interface QuantitativeAnalysisProps {
  data: QuantData[];
}

export function QuantitativeAnalysis({ data }: QuantitativeAnalysisProps) {
  const getScoreBadge = (score: string) => {
    const scoreMap = {
      'ALTA': { color: 'bg-green-500', icon: <TrendingUp className="w-3 h-3" /> },
      'LATERAL': { color: 'bg-yellow-500', icon: <Minus className="w-3 h-3" /> },
      'QUEDA': { color: 'bg-red-500', icon: <TrendingDown className="w-3 h-3" /> },
    };

    const config = scoreMap[score as keyof typeof scoreMap] || { color: 'bg-gray-500', icon: <Minus className="w-3 h-3" /> };
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {config.icon}
        {score}
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 bg-slate-800/50">
            <TableHead className="text-slate-300">Ação</TableHead>
            <TableHead className="text-slate-300 text-right">Momentum 20d</TableHead>
            <TableHead className="text-slate-300 text-right">Momentum 60d</TableHead>
            <TableHead className="text-slate-300 text-center">Reversão Média</TableHead>
            <TableHead className="text-slate-300 text-right">Sharpe Ratio</TableHead>
            <TableHead className="text-slate-300 text-right">Win Rate</TableHead>
            <TableHead className="text-slate-300 text-center">Score Final</TableHead>
            <TableHead className="text-slate-300 text-center">Confiança</TableHead>
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
              <TableCell className="text-right text-white">
                <span className={stock.momentum20 >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {stock.momentum20.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="text-right text-white">
                <span className={stock.momentum60 >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {stock.momentum60.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="text-center">
                {getScoreBadge(stock.meanReversion)}
              </TableCell>
              <TableCell className="text-right text-white">{stock.sharpeRatio.toFixed(2)}</TableCell>
              <TableCell className="text-right text-white">{stock.winRate.toFixed(1)}%</TableCell>
              <TableCell className="text-center">
                {getScoreBadge(stock.finalScore)}
              </TableCell>
              <TableCell className="text-center text-slate-300">{stock.confidence}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
