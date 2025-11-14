import dayjs from 'dayjs'
import { Candle, Series } from './types'

async function fetchAlphaVantageDaily(ticker: string, apiKey: string): Promise<Series> {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(ticker)}&outputsize=compact&apikey=${apiKey}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`AlphaVantage error ${res.status}`)
  const data = await res.json()
  const ts = data['Time Series (Daily)'] || data['Time Series Daily']
  if (!ts) throw new Error(data?.Note || 'AlphaVantage: No timeseries returned')
  const rows: Candle[] = Object.entries(ts).map(([date, v]: any) => ({
    time: dayjs(date).toISOString(),
    open: parseFloat(v['1. open'] || v.open),
    high: parseFloat(v['2. high'] || v.high),
    low: parseFloat(v['3. low'] || v.low),
    close: parseFloat(v['4. close'] || v.close),
    volume: parseFloat(v['6. volume'] || v.volume || v['5. volume'])
  }))
  rows.sort((a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf())
  return rows
}

function mockSeries(): Series {
  const start = dayjs().subtract(180, 'day')
  const out: Series = []
  let price = 100
  for (let i = 0; i < 130; i++) {
    const t = start.add(i, 'day')
    const noise = (Math.sin(i/7) + Math.cos(i/13)) * 0.8 + (Math.random()-0.5)*1.2
    const open = price
    const close = Math.max(5, price + noise)
    const high = Math.max(open, close) + Math.random() * 1.2
    const low = Math.min(open, close) - Math.random() * 1.2
    const volume = 1000000 + Math.round(Math.random()*500000)
    out.push({ time: t.toISOString(), open, high, low, close, volume })
    price = close
  }
  return out
}

export async function getSeries(ticker: string): Promise<Series> {
  const key = process.env.ALPHAVANTAGE_API_KEY
  if (key) {
    try {
      return await fetchAlphaVantageDaily(ticker, key)
    } catch (e) {
      // fallback to mock if provider throttles
      return mockSeries()
    }
  }
  return mockSeries()
}
