import { NextRequest, NextResponse } from 'next/server'
import { getSmartDiscounts } from '@/app/lib/smart-discounts'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ discounts: [] })
  const discounts = await getSmartDiscounts(userId)
  return NextResponse.json({ discounts })
}
