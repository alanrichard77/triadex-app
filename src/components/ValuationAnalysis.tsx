
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ValuationData {
  ticker: string;
  name: string;
  marketPrice: number;
  fairValue: number;
  discount: number;
  pe: number;
  pvp: number;
  roe: number;
  finalScore: string;
  confidence: number;
}

interface ValuationAnalysisProps {
  data: ValuationData[];
}

export function ValuationAnalysis({ data }: ValuationAnalysisProps) {
  const getScoreBadge = (score: string) => {
    const scoreMap = {
      'BARATO': { color: 'bg-green-500', icon: <TrendingUp className="w-3 h-3" /> },
      'JUSTO': { color: 'bg-yellow-500', icon: <Minus className="w-3 h-3" /> },
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

  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 bg-slate-800/50">
            <TableHead className="text-slate-300">Ação</TableHead>
            <TableHead className="text-slate-300 text-right">Preço Mercado</TableHead>
            <TableHead className="text-slate-300 text-right">Valor Justo</TableHead>
            <TableHead className="text-slate-300 text-right">Desconto</TableHead>
            <TableHead className="text-slate-300 text-right">P/L</TableHead>
            <TableHead className="text-slate-300 text-right">P/VP</TableHead>
            <TableHead className="text-slate-300 text-right">ROE</TableHead>
            <TableHead className="text-slate-300 text-center">Avaliação</TableHead>
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
              <TableCell className="text-right text-white font-medium">
                {formatCurrency(stock.marketPrice)}
              </TableCell>
              <TableCell className="text-right text-white">
                {formatCurrency(stock.fairValue)}
              </TableCell>
              <TableCell className="text-right">
                <span className={stock.discount < 0 ? 'text-green-400' : 'text-red-400'}>
                  {stock.discount.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="text-right text-slate-300">{stock.pe.toFixed(1)}</TableCell>
              <TableCell className="text-right text-slate-300">{stock.pvp.toFixed(2)}</TableCell>
              <TableCell className="text-right text-slate-300">{stock.roe.toFixed(1)}%</TableCell>
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
