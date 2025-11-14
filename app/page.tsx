"use client";

import { useState } from 'react';
import AnalyzerForm from '@/components/AnalyzerForm';
import ChartPanel from '@/components/ChartPanel';
import IndicatorCards from '@/components/IndicatorCards';
import Recommendation from '@/components/Recommendation';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

  return (
    <main className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Stock Analyzer & Recommendations</h1>
        <a href="https://agentic-20beea0e.vercel.app" className="text-sm text-blue-600 hover:underline" target="_blank">Production URL</a>
      </div>

      <AnalyzerForm
        onAnalyze={async (params) => {
          setLoading(true);
          setError(null);
          setAnalysis(null);
          try {
            const url = new URL('/api/analyze', window.location.origin);
            Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
            const res = await fetch(url.toString());
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const data = await res.json();
            setAnalysis(data);
          } catch (e: any) {
            setError(e?.message ?? 'Unexpected error');
          } finally {
            setLoading(false);
          }
        }}
      />

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <Recommendation summary={analysis.recommendation} />
          <ChartPanel series={analysis.series} overlays={analysis.overlays} />
          <IndicatorCards indicators={analysis.indicators} explanation={analysis.explanation} />
        </div>
      )}

      {!analysis && !loading && !error && (
        <p className="text-sm text-slate-500">Tip: Try tickers like AAPL (US) or RELIANCE.NS (NSE). Daily timeframe provides richer signals.</p>
      )}
    </main>
  );
}
