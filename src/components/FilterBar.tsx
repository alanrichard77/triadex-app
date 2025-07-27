
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
  selectedScore: string;
  onScoreChange: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedScore,
  onScoreChange,
  onExport,
  onRefresh,
  isLoading
}: FilterBarProps) {
  const sectors = [
    'Todos os setores',
    'Petróleo e Gás',
    'Mineração',
    'Bancos',
    'Varejo',
    'Tecnologia',
    'Energia Elétrica',
    'Telecomunicações',
    'Siderurgia',
    'Alimentos',
    'Papel e Celulose'
  ];

  const scores = [
    'Todos os scores',
    'OPORTUNIDADE',
    'LATERAL',
    'QUEDA'
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por ticker ou nome..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        
        <Select value={selectedSector} onValueChange={onSectorChange}>
          <SelectTrigger className="w-full lg:w-48 bg-slate-800/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector} className="text-white hover:bg-slate-700">
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedScore} onValueChange={onScoreChange}>
          <SelectTrigger className="w-full lg:w-48 bg-slate-800/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {scores.map((score) => (
              <SelectItem key={score} value={score} className="text-white hover:bg-slate-700">
                {score}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={onExport}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar (Premium)
        </Button>

        <Button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
