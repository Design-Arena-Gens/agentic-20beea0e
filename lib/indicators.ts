import { Candle } from './types';

function sliceCloses(series: Candle[]): number[] {
  return series.map((c) => c.close);
}

export function sma(values: number[], period: number): number[] {
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : NaN);
  }
  return out;
}

export function ema(values: number[], period: number): number[] {
  const out: number[] = [];
  const k = 2 / (period + 1);
  let prev: number | undefined;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (i === 0) {
      prev = v;
      out.push(v);
    } else {
      prev = (v - (prev as number)) * k + (prev as number);
      out.push(prev);
    }
  }
  return out.map((v, i) => (i >= period - 1 ? v : NaN));
}

export function rsi(values: number[], period = 14): number[] {
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains.push(Math.max(0, diff));
    losses.push(Math.max(0, -diff));
  }
  const avgGain: number[] = [];
  const avgLoss: number[] = [];
  let gSum = 0, lSum = 0;
  for (let i = 0; i < gains.length; i++) {
    gSum += gains[i];
    lSum += losses[i];
    if (i === period - 1) {
      avgGain.push(gSum / period);
      avgLoss.push(lSum / period);
    } else if (i >= period) {
      const prevG = avgGain[avgGain.length - 1];
      const prevL = avgLoss[avgLoss.length - 1];
      avgGain.push((prevG * (period - 1) + gains[i]) / period);
      avgLoss.push((prevL * (period - 1) + losses[i]) / period);
    } else {
      avgGain.push(NaN);
      avgLoss.push(NaN);
    }
  }
  const rsiArr: number[] = [NaN];
  for (let i = 0; i < avgGain.length; i++) {
    if (i < period - 1) {
      rsiArr.push(NaN);
    } else {
      const rs = avgLoss[i] === 0 ? 100 : avgGain[i] / avgLoss[i];
      const r = 100 - 100 / (1 + rs);
      rsiArr.push(r);
    }
  }
  return rsiArr;
}

export function macd(values: number[], fast = 12, slow = 26, signal = 9): { macd: number[]; signal: number[]; histogram: number[] } {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine = values.map((_, i) => emaFast[i] - emaSlow[i]);
  const signalLine = ema(macdLine.map((v) => (Number.isFinite(v) ? v : 0)), signal);
  const hist = macdLine.map((v, i) => v - signalLine[i]);
  return { macd: macdLine, signal: signalLine, histogram: hist };
}

export function atr(series: Candle[], period = 14): number[] {
  const tr: number[] = [];
  for (let i = 0; i < series.length; i++) {
    const cur = series[i];
    const prevClose = i > 0 ? series[i - 1].close : cur.close;
    const t = Math.max(
      cur.high - cur.low,
      Math.abs(cur.high - prevClose),
      Math.abs(cur.low - prevClose)
    );
    tr.push(t);
  }
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < tr.length; i++) {
    sum += tr[i];
    if (i >= period) sum -= tr[i - period];
    out.push(i >= period - 1 ? sum / period : NaN);
  }
  return out;
}

export function volumeSpike(series: Candle[], lookback = 20, threshold = 1.8): boolean[] {
  const vols = series.map((c) => c.volume);
  const smaVol = sma(vols, lookback);
  return vols.map((v, i) => (i >= lookback - 1 ? v > threshold * (smaVol[i] || 0) : false));
}

export function computeAllIndicators(series: Candle[]) {
  const closes = sliceCloses(series);
  const out = {
    sma20: sma(closes, 20),
    sma50: sma(closes, 50),
    rsi14: rsi(closes, 14),
    macd: macd(closes),
    atr14: atr(series, 14),
    volumeSignal: { spike: volumeSpike(series) }
  };
  return out;
}
