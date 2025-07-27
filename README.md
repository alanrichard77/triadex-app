
# Projeto Triadez - Scanner de Ações B3

## 🎯 Visão Geral

O Projeto Triadez é um scanner avançado das 400 ações mais líquidas da B3, oferecendo análises quantitativas, técnicas e de valuation através de algoritmos proprietários baseados nas metodologias de Jim Simons, Turtle Traders e Aswath Damodaran.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Next.js 14 App Router
- **API**: RESTful endpoints
- **Dados**: Integração com brapi.dev para cotações em tempo real
- **UI**: shadcn/ui components

## 📊 Módulos de Análise

### 1. Análise Quantitativa (Jim Simons)
- Momentum de 20, 60 e 120 dias
- Reversão à média
- Detecção de anomalias de volume
- Índice de Sharpe
- Taxa de acerto (Win Rate)
- Score de volatilidade

### 2. Análise Técnica (Turtle Traders)
- Breakouts de 20 e 10 períodos
- Cálculo de ATR (Average True Range)
- Sinais de compra/venda
- Gestão de risco
- Cálculo de posição
- Relação risco/retorno

### 3. Análise de Valuation (Damodaran DCF)
- Fluxo de Caixa Descontado
- Cálculo de WACC
- Projeções de crescimento
- Valor terminal
- Múltiplos de mercado (P/E, EV/EBITDA, P/VP)
- ROE e estrutura de capital

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <seu-repositorio>
cd projeto-triadez

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
/
├── lib/
│   ├── b3stocks.ts          # Lista das 400 ações da B3
│   └── fetchers.ts          # Funções para buscar dados da API
├── utils/
│   └── getFullStockData.ts  # Agregador de dados completos
├── app/api/
│   ├── stocks/route.ts      # Endpoint para dados das ações
│   ├── quant/route.ts       # Análise quantitativa
│   ├── technical/route.ts   # Análise técnica
│   └── valuation/route.ts   # Análise de valuation
├── components/
│   └── ScannerTable.tsx     # Interface principal do scanner
└── README.md
```

## 🔌 Endpoints da API

### GET /api/stocks
Busca dados das ações com paginação.

**Parâmetros:**
- `limit`: Número de ações por página (padrão: 50)
- `offset`: Offset para paginação (padrão: 0)  
- `mock`: Use dados mock para desenvolvimento (padrão: false)

**Exemplo:**
```bash
curl "http://localhost:3000/api/stocks?limit=10&mock=true"
```

### POST /api/quant
Executa análise quantitativa.

**Payload:**
```json
{
  "stockData": [
    {
      "ticker": "PETR4",
      "price": 30.50,
      "priceHistory": [
        {
          "date": "2024-01-01",
          "close": 29.80,
          "volume": 1000000
        }
      ]
    }
  ]
}
```

**Resposta:**
```json
{
  "signals": [
    {
      "ticker": "PETR4",
      "momentum20": 5.2,
      "momentum60": -2.1,
      "momentum120": 8.3,
      "meanReversion": "ALTA",
      "volumeAnomaly": true,
      "volatilityScore": 2.5,
      "sharpeRatio": 1.2,
      "winRate": 58.5,
      "finalScore": "ALTA",
      "confidence": 75.0
    }
  ]
}
```

### POST /api/technical
Executa análise técnica.

**Payload:**
```json
{
  "stockData": [
    {
      "ticker": "PETR4",
      "priceHistory": [
        {
          "date": "2024-01-01",
          "open": 29.50,
          "high": 30.80,
          "low": 29.20,
          "close": 30.50,
          "volume": 1000000
        }
      ]
    }
  ],
  "capital": 100000
}
```

**Resposta:**
```json
{
  "signals": [
    {
      "ticker": "PETR4",
      "price": 30.50,
      "high20": 32.00,
      "low20": 28.00,
      "atr": 1.25,
      "atrPercent": 4.1,
      "signal": "COMPRA",
      "entryPrice": 30.50,
      "stopLoss": 28.00,
      "targetPrice": 34.25,
      "positionSize": 1600,
      "riskReward": 1.5,
      "finalScore": "ALTA"
    }
  ]
}
```

### POST /api/valuation
Executa análise de valuation.

**Payload:**
```json
{
  "stockData": [
    {
      "ticker": "PETR4",
      "price": 30.50,
      "fundamentals": {
        "revenue": 500000000,
        "netIncome": 50000000,
        "totalDebt": 100000000,
        "cash": 20000000,
        "shares": 10000000,
        "roe": 15.2,
        "pe": 12.5,
        "evEbitda": 8.2,
        "pvp": 1.8
      }
    }
  ]
}
```

**Resposta:**
```json
{
  "valuations": [
    {
      "ticker": "PETR4",
      "marketPrice": 30.50,
      "fairValue": 35.20,
      "discount": -13.4,
      "wacc": 12.5,
      "terminalGrowth": 2.5,
      "fcfGrowth5y": 8.2,
      "debtToEquity": 0.33,
      "roe": 15.2,
      "pe": 12.5,
      "evEbitda": 8.2,
      "pvp": 1.8,
      "finalScore": "BARATO",
      "confidence": 82.1
    }
  ]
}
```

## 🎮 Como Usar

1. **Acesse a aplicação**: Abra `http://localhost:3000`
2. **Clique em "Iniciar Análise"**: O scanner processará as ações automaticamente
3. **Visualize os resultados**: Use as abas para navegar entre os diferentes tipos de análise
4. **Interprete os scores**:
   - **Verde**: Oportunidade de alta/compra
   - **Amarelo**: Lateral/neutro
   - **Vermelho**: Queda/venda

## 🔧 Configurações

### Modo de Desenvolvimento
Para usar dados mock durante desenvolvimento, adicione `?mock=true` nas chamadas da API ou use o parâmetro no frontend.

### Personalização de Capital
A análise técnica permite definir o capital disponível para cálculo de posição:
```javascript
const response = await fetch('/api/technical', {
  method: 'POST',
  body: JSON.stringify({ stockData, capital: 500000 }) // R$ 500.000
});
```

### Ajuste de Parâmetros
Os algoritmos podem ser ajustados editando os arquivos em `/app/api/`:
- **Quantitativo**: Períodos de momentum, limiares de anomalias
- **Técnico**: Períodos de breakout, multiplicadores de ATR
- **Valuation**: Taxa livre de risco, prêmio de risco, crescimento terminal

## 📈 Interpretação dos Resultados

### Análise Quantitativa
- **Momentum positivo**: Tendência de alta
- **Sharpe > 1**: Boa relação risco/retorno
- **Win Rate > 55%**: Estratégia historicamente lucrativa
- **Volume Anomaly**: Possível catalisador

### Análise Técnica
- **Breakout de máximas**: Sinal de compra
- **ATR alto**: Maior volatilidade, ajustar posição
- **Risk/Reward > 1.5**: Operação favorável

### Valuation
- **Desconto negativo**: Ação subavaliada
- **ROE > 15%**: Empresa eficiente
- **P/E < 15**: Múltiplo atrativo

## 🚀 Deploy

### Desenvolvimento Local
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```
BRAPI_TOKEN=seu_token_brapi
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Email: suporte@triadez.com
- GitHub Issues: [Link para issues]
- Documentação: [Link para docs]

---

**Desenvolvido com ❤️ para o mercado financeiro brasileiro**
