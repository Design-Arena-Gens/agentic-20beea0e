export type Candle = {
  time: string; // ISO date string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Series = Candle[];

export type IndicatorValues = {
  sma20?: number[];
  sma50?: number[];
  rsi14?: number[];
  macd?: { macd: number[]; signal: number[]; histogram: number[] };
  atr14?: number[];
  volumeSignal?: {
    spike: boolean[]; // true when volume spike detected
  };
};

export type Recommendation = {
  action: 'BUY' | 'HOLD' | 'SELL';
  confidence: number; // 0..1
  riskNote: string;
  positionSizingHint: string;
};

export type AnalysisResponse = {
  ticker: string;
  granularity: string;
  series: { time: string[]; close: number[]; volume: number[] };
  overlays: { sma20?: number[]; sma50?: number[] };
  indicators: {
    rsi14?: number[];
    macd?: { macd: number[]; signal: number[]; histogram: number[] };
    atr14?: number[];
    volumeSpike?: boolean[];
  };
  recommendation: Recommendation;
  explanation: string[];
};
