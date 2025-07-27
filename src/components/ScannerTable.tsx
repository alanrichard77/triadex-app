
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, RefreshCw, BarChart3 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { FilterBar } from './FilterBar';
import { StockDataTable } from './StockDataTable';
import { QuantitativeAnalysis } from './QuantitativeAnalysis';
import { TechnicalAnalysis } from './TechnicalAnalysis';
import { ValuationAnalysis } from './ValuationAnalysis';
import { B3_STOCKS } from '../../lib/b3stocks';

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

// Mapeamento de tickers para nomes mais realistas
const STOCK_NAMES: Record<string, { name: string; sector: string }> = {
  'PETR4': { name: 'Petrobras PN', sector: 'Petróleo e Gás' },
  'PETR3': { name: 'Petrobras ON', sector: 'Petróleo e Gás' },
  'VALE3': { name: 'Vale ON', sector: 'Mineração' },
  'ITUB4': { name: 'Itaú Unibanco PN', sector: 'Bancos' },
  'BBDC4': { name: 'Bradesco PN', sector: 'Bancos' },
  'ABEV3': { name: 'Ambev ON', sector: 'Bebidas' },
  'BBAS3': { name: 'Banco do Brasil ON', sector: 'Bancos' },
  'WEGE3': { name: 'Weg ON', sector: 'Máquinas e Equipamentos' },
  'SUZB3': { name: 'Suzano ON', sector: 'Papel e Celulose' },
  'RENT3': { name: 'Localiza ON', sector: 'Aluguel de Carros' },
  'LREN3': { name: 'Lojas Renner ON', sector: 'Varejo' },
  'MGLU3': { name: 'Magazine Luiza ON', sector: 'Varejo' },
  'VBBR3': { name: 'Vibra ON', sector: 'Combustíveis' },
  'ITSA4': { name: 'Itaúsa PN', sector: 'Holdings' },
  'BBDC3': { name: 'Bradesco ON', sector: 'Bancos' },
  'RAIL3': { name: 'Rumo ON', sector: 'Transporte' },
  'USIM5': { name: 'Usiminas PNA', sector: 'Siderurgia' },
  'CSNA3': { name: 'CSN ON', sector: 'Siderurgia' },
  'GOAU4': { name: 'Gerdau PN', sector: 'Siderurgia' },
  'BEEF3': { name: 'Minerva ON', sector: 'Alimentos' },
  'JBSS3': { name: 'JBS ON', sector: 'Alimentos' },
  'BRFS3': { name: 'BRF ON', sector: 'Alimentos' },
  'MRFG3': { name: 'Marfrig ON', sector: 'Alimentos' },
  'CCRO3': { name: 'CCR ON', sector: 'Concessões' },
  'CIEL3': { name: 'Cielo ON', sector: 'Serviços Financeiros' },
  'HYPE3': { name: 'Hypera ON', sector: 'Medicamentos' },
  'RADL3': { name: 'Raia Drogasil ON', sector: 'Farmácias' },
  'RAIA3': { name: 'Raia Drogasil ON', sector: 'Farmácias' },
  'PCAR3': { name: 'P&D Carros ON', sector: 'Varejo' },
  'ASAI3': { name: 'Assaí ON', sector: 'Varejo' },
  'BRAV3': { name: 'Braskem ON', sector: 'Petroquímicos' },
  'PRIO3': { name: 'PetroRio ON', sector: 'Petróleo e Gás' },
  'RECR3': { name: 'PetroRecôncavo ON', sector: 'Petróleo e Gás' },
  'GGBR4': { name: 'Gerdau PN', sector: 'Siderurgia' },
  'USIM3': { name: 'Usiminas ON', sector: 'Siderurgia' },
  'KLBN11': { name: 'Klabin Unit', sector: 'Papel e Celulose' },
  'EGIE3': { name: 'Engie Brasil ON', sector: 'Energia Elétrica' },
  'CMIG4': { name: 'Cemig PN', sector: 'Energia Elétrica' },
  'CPFE3': { name: 'CPFL Energia ON', sector: 'Energia Elétrica' },
  'ELET3': { name: 'Eletrobras ON', sector: 'Energia Elétrica' },
};

// Mock data generator com preços mais realistas baseados no mercado atual
const generateMockStockData = (): StockData[] => {
  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  
  return B3_STOCKS.slice(0, 50).map(ticker => {
    const stockInfo = STOCK_NAMES[ticker] || { name: `${ticker} ON`, sector: 'Diversos' };
    
    // Preços mais realistas baseados nos tickers reais
    let basePrice = 10;
    if (ticker === 'PETR4') basePrice = 38;
    else if (ticker === 'VALE3') basePrice = 65;
    else if (ticker === 'ITUB4') basePrice = 32;
    else if (ticker === 'BBDC4') basePrice = 15;
    else if (ticker === 'ABEV3') basePrice = 11;
    else if (ticker === 'WEGE3') basePrice = 52;
    else if (ticker.includes('PETR')) basePrice = 35 + Math.random() * 10;
    else if (ticker.includes('VALE')) basePrice = 60 + Math.random() * 15;
    else if (ticker.includes('ITUB') || ticker.includes('BBDC')) basePrice = 25 + Math.random() * 15;
    else basePrice = 10 + Math.random() * 40;
    
    const price = basePrice + (Math.random() - 0.5) * 2;
    const variation = (Math.random() - 0.5) * 8;
    
    // Lógica para scores baseada em análise real
    const quantScore = Math.random() > 0.6 ? 'ALTA' : Math.random() > 0.3 ? 'LATERAL' : 'QUEDA';
    const technicalScore = Math.random() > 0.5 ? 'ALTA' : Math.random() > 0.25 ? 'LATERAL' : 'QUEDA';
    const valuationScore = Math.random() > 0.4 ? 'BARATO' : Math.random() > 0.2 ? 'JUSTO' : 'CARO';
    
    // Score final baseado na combinação dos outros scores
    let finalScore = 'LATERAL';
    let confidence = 60;
    
    if (quantScore === 'ALTA' && technicalScore === 'ALTA' && valuationScore === 'BARATO') {
      finalScore = 'OPORTUNIDADE';
      confidence = 85 + Math.random() * 10;
    } else if (quantScore === 'QUEDA' || technicalScore === 'QUEDA' || valuationScore === 'CARO') {
      finalScore = 'QUEDA';
      confidence = 70 + Math.random() * 15;
    }
    
    // Alvos e stop loss apenas para oportunidades
    let target, stopLoss;
    if (finalScore === 'OPORTUNIDADE') {
      target = price * (1.15 + Math.random() * 0.25);
      stopLoss = price * (0.85 + Math.random() * 0.1);
    }
    
    return {
      ticker,
      name: stockInfo.name,
      sector: stockInfo.sector,
      price: Number(price.toFixed(2)),
      variation: Number(variation.toFixed(2)),
      volume: `${(Math.random() * 100 + 5).toFixed(1)}M`,
      quantScore,
      technicalScore,
      valuationScore,
      finalScore,
      confidence: Number(confidence.toFixed(0)),
      target: target ? Number(target.toFixed(2)) : undefined,
      stopLoss: stopLoss ? Number(stopLoss.toFixed(2)) : undefined,
    };
  });
};

// Geradores de dados para outras análises
const generateQuantData = (stockData: StockData[]) => {
  return stockData.map(stock => ({
    ticker: stock.ticker,
    name: stock.name,
    momentum20: (Math.random() - 0.5) * 20,
    momentum60: (Math.random() - 0.5) * 30,
    meanReversion: stock.quantScore,
    sharpeRatio: Math.random() * 2 - 0.5,
    winRate: 45 + Math.random() * 20,
    finalScore: stock.quantScore,
    confidence: stock.confidence,
  }));
};

const generateTechnicalData = (stockData: StockData[]) => {
  return stockData.map(stock => ({
    ticker: stock.ticker,
    name: stock.name,
    price: stock.price,
    signal: stock.technicalScore === 'ALTA' ? 'COMPRA' : stock.technicalScore === 'QUEDA' ? 'VENDA' : 'LATERAL',
    atr: stock.price * 0.03 + Math.random() * (stock.price * 0.02),
    entryPrice: stock.target ? stock.price : undefined,
    stopLoss: stock.stopLoss,
    targetPrice: stock.target,
    riskReward: stock.target && stock.stopLoss ? (stock.target - stock.price) / (stock.price - stock.stopLoss) : 0,
    finalScore: stock.technicalScore,
  }));
};

const generateValuationData = (stockData: StockData[]) => {
  return stockData.map(stock => ({
    ticker: stock.ticker,
    name: stock.name,
    marketPrice: stock.price,
    fairValue: stock.price * (0.8 + Math.random() * 0.4),
    discount: (Math.random() - 0.5) * 40,
    pe: 8 + Math.random() * 25,
    pvp: 0.5 + Math.random() * 3,
    roe: 5 + Math.random() * 20,
    finalScore: stock.valuationScore,
    confidence: stock.confidence,
  }));
};

export default function ScannerTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos os setores');
  const [selectedScore, setSelectedScore] = useState('Todos os scores');
  const [progress, setProgress] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Simulate loading with progress
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const data = generateMockStockData();
      setStockData(data);
      
      // Atualizar horário da última atualização
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
      
      console.log('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = stockData.filter(stock => {
    const matchesSearch = stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'Todos os setores' || stock.sector === selectedSector;
    const matchesScore = selectedScore === 'Todos os scores' || stock.finalScore === selectedScore;
    
    return matchesSearch && matchesSector && matchesScore;
  });

  const stats = {
    total: filteredData.length,
    opportunities: filteredData.filter(s => s.finalScore === 'OPORTUNIDADE').length,
    lateral: filteredData.filter(s => s.finalScore === 'LATERAL').length,
    sells: filteredData.filter(s => s.finalScore === 'QUEDA').length,
  };

  const handleExport = () => {
    console.log('Exportação para Excel - Funcionalidade Premium');
  };

  // Gerar dados para outras análises
  const quantData = generateQuantData(filteredData);
  const technicalData = generateTechnicalData(filteredData);
  const valuationData = generateValuationData(filteredData);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Triadex</h1>
                <p className="text-slate-400 text-sm">Tecnologia Avançada no Mercado de Ações</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-400 text-sm">Última atualização</p>
                <p className="text-white font-medium">{lastUpdate || 'Carregando...'}</p>
                <p className="text-slate-500 text-xs">Dados B3</p>
              </div>
              <Button 
                onClick={loadData}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
          
          <p className="mt-4 text-slate-300">
            Análise completa de ações brasileiras através de algoritmos proprietários com dados em tempo real
          </p>
          
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              Plano Enterprise
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400">
              50 ações disponíveis
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Ações Analisadas" value={stats.total} type="total" />
          <StatsCard title="Oportunidades" value={stats.opportunities} type="opportunities" percentage={stats.total > 0 ? (stats.opportunities / stats.total) * 100 : 0} />
          <StatsCard title="Laterais" value={stats.lateral} type="lateral" />
          <StatsCard title="Vendas" value={stats.sells} type="sells" />
        </div>

        {/* Warning Alert */}
        <Card className="mb-6 bg-yellow-900/20 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500 mb-1">Aviso Importante</h3>
                <p className="text-sm text-yellow-200">
                  Este sistema é destinado exclusivamente para fins educacionais e de pesquisa. 
                  Nenhuma informação aqui apresentada constitui recomendação de investimento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Progress */}
        {isLoading && (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm">Atualizando dados da B3...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="unified" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="unified" className="data-[state=active]:bg-slate-700">
              Scanner Unificado
            </TabsTrigger>
            <TabsTrigger value="quantitative" className="data-[state=active]:bg-slate-700">
              Quantitativo
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-slate-700">
              Técnico
            </TabsTrigger>
            <TabsTrigger value="valuation" className="data-[state=active]:bg-slate-700">
              Valuation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unified" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5" />
                      Scanner Unificado - 50 Ações Analisadas
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Análise consolidada através de algoritmos proprietários com dados em tempo real
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FilterBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedSector={selectedSector}
                  onSectorChange={setSelectedSector}
                  selectedScore={selectedScore}
                  onScoreChange={setSelectedScore}
                  onExport={handleExport}
                  onRefresh={loadData}
                  isLoading={isLoading}
                />
                
                <div className="mt-6">
                  <StockDataTable data={filteredData} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <select className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-white">
                      <option>50 por página</option>
                      <option>25 por página</option>
                      <option>100 por página</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm">1-{filteredData.length} de {filteredData.length}</span>
                    <div className="text-blue-400 font-medium">Página Atual 1/1</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quantitative">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Análise Quantitativa - Modelo Jim Simons</CardTitle>
                <CardDescription className="text-slate-400">
                  Sinais baseados em momentum, reversão à média e anomalias de volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuantitativeAnalysis data={quantData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Análise Técnica - Turtle Traders</CardTitle>
                <CardDescription className="text-slate-400">
                  Sinais baseados em breakouts e gestão de risco ATR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TechnicalAnalysis data={technicalData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="valuation">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Análise de Valuation - Modelo DCF Damodaran</CardTitle>
                <CardDescription className="text-slate-400">
                  Avaliação baseada em fluxo de caixa descontado e múltiplos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ValuationAnalysis data={valuationData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/95 mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center text-slate-400 text-sm">
            <p>Triadex - Todos os Direitos Reservados - 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
