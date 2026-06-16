import { NextResponse } from 'next/server'

const OWM_KEY = process.env.OWM_KEY
const MANALI_LAT = 32.257055
const MANALI_LON = 77.176140

export async function GET() {
  if (!OWM_KEY) {
    return NextResponse.json({ error: 'No API key' }, { status: 500 })
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MANALI_LAT}&lon=${MANALI_LON}&units=metric&appid=${OWM_KEY}`
    const res = await fetch(url, { next: { revalidate: 600 } })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}