import { getPayload } from 'payload'
import config from '@payload-config'

export const POINTS_PER_TRY = 1 / 3  // 1 балл за 3 TRY
export const POINTS_TO_TRY = 0.5      // 10 баллов = 5 TRY → 1 балл = 0.5 TRY

export async function awardPoints(
  userId: string | number,
  points: number,
  reason: string,
  orderId?: string,
) {
  const payload = await getPayload({ config })
  return payload.create({
    collection: 'points',
    data: { user: userId as any, points, type: 'earned', reason: reason as any, orderId },
    overrideAccess: true,
  })
}

export async function spendPoints(userId: string | number, points: number) {
  const balance = await getBalance(userId)
  if (balance < points) throw new Error('Insufficient points balance')
  const payload = await getPayload({ config })
  return payload.create({
    collection: 'points',
    data: { user: userId as any, points, type: 'spent', reason: 'spend' as any },
    overrideAccess: true,
  })
}

export async function getBalance(userId: string | number): Promise<number> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'points',
    where: { user: { equals: userId } },
    limit: 1000,
    overrideAccess: true,
  })
  return docs.reduce((sum, p) => {
    return sum + (p.type === 'earned' ? p.points : -p.points)
  }, 0)
}

export async function getHistory(userId: string | number) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'points',
    where: { user: { equals: userId } },
    sort: '-createdAt',
    limit: 50,
    overrideAccess: true,
  })
  return docs
}

export function calcPointsForPurchase(amountTRY: number): number {
  return Math.floor(amountTRY * POINTS_PER_TRY)
}
