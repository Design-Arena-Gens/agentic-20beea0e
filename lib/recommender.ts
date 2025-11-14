import { Candle, Recommendation } from './types';
import { computeAllIndicators } from './indicators';

export function generateRecommendation(series: Candle[]): { rec: Recommendation; explanation: string[]; overlays: { sma20: number[]; sma50: number[] }; indicators: ReturnType<typeof computeAllIndicators> } {
  const ind = computeAllIndicators(series);
  const n = series.length;
  const last = n - 1;
  const expl: string[] = [];

  let score = 0;

  // SMA trend
  const smaBull = (ind.sma20?.[last] ?? NaN) > (ind.sma50?.[last] ?? NaN);
  if (smaBull) {
    score += 1; expl.push('SMA20 is above SMA50: bullish trend.');
  } else {
    score -= 1; expl.push('SMA20 is below SMA50: bearish/neutral trend.');
  }

  // RSI momentum
  const rsi = ind.rsi14?.[last] ?? NaN;
  if (Number.isFinite(rsi)) {
    if (rsi < 30) { score += 0.8; expl.push(`RSI ${rsi.toFixed(1)}: oversold.`); }
    else if (rsi > 70) { score -= 0.8; expl.push(`RSI ${rsi.toFixed(1)}: overbought.`); }
    else if (rsi > 50) { score += 0.3; expl.push(`RSI ${rsi.toFixed(1)}: positive momentum.`); }
    else { score -= 0.1; expl.push(`RSI ${rsi.toFixed(1)}: weak momentum.`); }
  }

  // MACD signal
  const macd = ind.macd;
  if (macd) {
    const macdVal = macd.macd[last];
    const signalVal = macd.signal[last];
    if (macdVal > signalVal) { score += 0.6; expl.push('MACD > Signal: bullish cross.'); }
    else { score -= 0.4; expl.push('MACD < Signal: bearish/neutral.'); }
  }

  // Volume spike
  const volSpike = ind.volumeSignal.spike[last] === true;
  if (volSpike) { score += 0.3; expl.push('Volume spike: confirms move.'); }

  // Risk via ATR as % of price
  const price = series[last].close;
  const atr = ind.atr14?.[last] ?? NaN;
  let riskPct = 0.02;
  if (Number.isFinite(atr) && price > 0) {
    const atrPct = atr / price;
    if (atrPct > 0.05) { score -= 0.4; expl.push(`High volatility (ATR ${(atrPct*100).toFixed(1)}%).`); }
    riskPct = Math.min(0.03, Math.max(0.005, atrPct));
  }

  let action: Recommendation['action'] = 'HOLD';
  if (score >= 1.2) action = 'BUY';
  else if (score <= -0.8) action = 'SELL';

  const confidence = Math.min(1, Math.max(0.1, Math.abs(score) / 2));

  const rec: Recommendation = {
    action,
    confidence,
    riskNote: Number.isFinite(atr) ? `ATR ${atr.toFixed(2)} (~${((atr/price)*100).toFixed(1)}% of price)` : 'ATR unavailable',
    positionSizingHint: `Risk ~${(riskPct*100).toFixed(1)}% per trade; size = bankroll * ${riskPct.toFixed(3)}`,
  };

  return {
    rec,
    explanation: expl,
    overlays: { sma20: ind.sma20 ?? [], sma50: ind.sma50 ?? [] },
    indicators: ind,
  };
}
