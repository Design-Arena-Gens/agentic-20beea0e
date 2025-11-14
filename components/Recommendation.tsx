import { Recommendation as Rec } from '@/lib/types'

export default function Recommendation({ summary }: { summary: Rec }) {
  const color = summary.action === 'BUY' ? 'bg-green-50 border-green-300 text-green-800' : summary.action === 'SELL' ? 'bg-red-50 border-red-300 text-red-800' : 'bg-slate-50 border-slate-300 text-slate-800'

  return (
    <div className={`rounded-md border p-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm">Recommendation</div>
        <div className="text-xs">Confidence: {(summary.confidence*100).toFixed(0)}%</div>
      </div>
      <div className="mt-1 text-2xl font-bold">{summary.action}</div>
      <div className="mt-2 text-sm">{summary.riskNote}</div>
      <div className="mt-1 text-sm text-slate-600">{summary.positionSizingHint}</div>
    </div>
  )
}
