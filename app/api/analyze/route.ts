import { NextRequest, NextResponse } from 'next/server'
import { getSeries } from '@/lib/dataProvider'
import { generateRecommendation } from '@/lib/recommender'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get('ticker') || 'AAPL'

  try {
    const series = await getSeries(ticker)
    if (!series || series.length < 30) {
      return NextResponse.json({ error: 'Insufficient data' }, { status: 400 })
    }

    const { rec, explanation, overlays, indicators } = generateRecommendation(series)

    const response = {
      ticker,
      granularity: '1d',
      series: {
        time: series.map((c) => c.time),
        close: series.map((c) => c.close),
        volume: series.map((c) => c.volume),
      },
      overlays: {
        sma20: overlays.sma20,
        sma50: overlays.sma50,
      },
      indicators: {
        rsi14: indicators.rsi14,
        macd: indicators.macd,
        atr14: indicators.atr14,
        volumeSpike: indicators.volumeSignal.spike,
      },
      recommendation: rec,
      explanation,
    }

    return NextResponse.json(response)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
