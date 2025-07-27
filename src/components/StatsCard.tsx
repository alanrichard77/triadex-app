
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  type: 'total' | 'opportunities' | 'lateral' | 'sells';
  percentage?: number;
}

export function StatsCard({ title, value, type, percentage }: StatsCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'opportunities':
        return <TrendingUp className="w-6 h-6 text-green-400" />;
      case 'sells':
        return <TrendingDown className="w-6 h-6 text-red-400" />;
      case 'lateral':
        return <Minus className="w-6 h-6 text-yellow-400" />;
      default:
        return <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white"></div>
        </div>;
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'opportunities':
        return 'text-green-400';
      case 'sells':
        return 'text-red-400';
      case 'lateral':
        return 'text-yellow-400';
      default:
        return 'text-white';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getValueColor()}`}>
                {value}
              </span>
              {percentage && (
                <span className="text-green-400 text-sm font-medium">
                  {percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-700/50">
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
