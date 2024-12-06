import { NextResponse } from 'next/server'
import { scrapeDeals } from '@/lib/scrapers'
import { deals as dummyDeals } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    const result = await scrapeDeals('maxima')
    
    if (result.errors && result.errors.length > 0) {
      console.warn('Scraping warnings:', result.errors)
    }

    if (result.deals.length > 0) {
      return NextResponse.json(
        { deals: result.deals },
        { 
          headers: {
            'Cache-Control': 'public, s-maxage=3600',
          }
        }
      )
    }

    return NextResponse.json(
      { 
        deals: dummyDeals,
        warning: 'Using fallback data - could not fetch live deals'
      }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        deals: dummyDeals,
        error: error instanceof Error ? error.message : 'Failed to fetch deals',
        warning: 'Using fallback data due to error'
      }
    )
  }
}