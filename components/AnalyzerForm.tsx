"use client";

import { useState } from 'react';

type Props = {
  onAnalyze: (params: { ticker: string }) => Promise<void>;
};

export default function AnalyzerForm({ onAnalyze }: Props) {
  const [ticker, setTicker] = useState('AAPL');
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4 grid gap-3 md:grid-cols-[1fr_auto] items-end"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try { await onAnalyze({ ticker: ticker.trim().toUpperCase() }); }
        finally { setBusy(false); }
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Ticker</label>
        <input
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., AAPL, MSFT, RELIANCE.NS, TCS.NS, SBIN.NS"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-500">Use suffix .NS for NSE, .BO for BSE (e.g., RELIANCE.NS)</p>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 disabled:opacity-60"
      >
        {busy ? 'Analyzing?' : 'Analyze'}
      </button>
    </form>
  );
}
