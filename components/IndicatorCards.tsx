export default function IndicatorCards({ indicators, explanation }: { indicators: any; explanation: string[] }) {
  const lastIdx = indicators?.rsi14?.length ? indicators.rsi14.length - 1 : -1;
  const fmt = (n: number | undefined) => (Number.isFinite(n) ? (n as number).toFixed(2) : '?');

  const rsi = lastIdx >= 0 ? indicators.rsi14[lastIdx] : undefined;
  const macd = indicators.macd ? indicators.macd.macd[lastIdx] : undefined;
  const signal = indicators.macd ? indicators.macd.signal[lastIdx] : undefined;
  const atr = lastIdx >= 0 ? indicators.atr14[lastIdx] : undefined;
  const volSpike = indicators.volumeSpike?.[lastIdx] === true;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <div className="text-xs text-slate-500">RSI(14)</div>
        <div className="text-xl font-semibold">{fmt(rsi)}</div>
      </div>
      <div className="rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <div className="text-xs text-slate-500">MACD</div>
        <div className="text-sm">MACD: {fmt(macd)}</div>
        <div className="text-sm">Signal: {fmt(signal)}</div>
      </div>
      <div className="rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <div className="text-xs text-slate-500">ATR(14)</div>
        <div className="text-xl font-semibold">{fmt(atr)}</div>
      </div>
      <div className="rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <div className="text-xs text-slate-500">Volume</div>
        <div className={`text-sm font-medium ${volSpike ? 'text-bull' : 'text-slate-500'}`}>{volSpike ? 'Spike detected' : 'Normal'}</div>
      </div>

      <div className="md:col-span-4 rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <div className="text-sm font-medium mb-2">Indicator Breakdown</div>
        <ul className="list-disc list-inside text-sm space-y-1">
          {explanation.map((e: string, i: number) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
