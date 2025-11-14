"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler);

export default function ChartPanel({
  series,
  overlays,
}: {
  series: { time: string[]; close: number[] };
  overlays: { sma20?: number[]; sma50?: number[] };
}) {
  const data = {
    labels: series.time.map((t) => new Date(t).toLocaleDateString()),
    datasets: [
      {
        label: 'Close',
        data: series.close,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.1)',
        tension: 0.2,
        pointRadius: 0,
        fill: true,
        yAxisID: 'y',
      },
      overlays.sma20 ? {
        label: 'SMA 20',
        data: overlays.sma20,
        borderColor: '#16a34a',
        borderWidth: 1.5,
        pointRadius: 0,
        yAxisID: 'y',
      } : undefined,
      overlays.sma50 ? {
        label: 'SMA 50',
        data: overlays.sma50,
        borderColor: '#f59e0b',
        borderWidth: 1.5,
        pointRadius: 0,
        yAxisID: 'y',
      } : undefined,
    ].filter(Boolean) as any[],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
      y: { display: true, grid: { color: 'rgba(148,163,184,0.2)' } },
      x: { display: true, grid: { color: 'rgba(148,163,184,0.1)' } },
    },
  };

  return (
    <div className="rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4 h-[420px]">
      <Line data={data} options={options} />
    </div>
  );
}
