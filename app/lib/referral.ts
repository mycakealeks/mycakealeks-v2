import { getPayload } from 'payload'
import config from '@payload-config'
import { awardPoints } from './points'

const REFERRAL_REWARD_POINTS = 20

export function generateReferralCode(userId: string): string {
  const base = userId.toString().slice(-6).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `REF${base}${rand}`
}

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'referrals',
    where: { referrer: { equals: userId } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return (existing.docs[0] as any).code
  }

  const code = generateReferralCode(userId)
  await payload.create({
    collection: 'referrals',
    data: { referrer: userId, code, status: 'pending', reward: 0 },
  })
  return code
}

export async function applyReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code) return false
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'referrals',
    where: { code: { equals: code.toUpperCase() } },
    limit: 1,
  })

  const ref = result.docs[0] as any
  if (!ref) return false

  const referrerId = typeof ref.referrer === 'object' ? ref.referrer.id : ref.referrer
  if (referrerId === newUserId) return false

  await payload.update({
    collection: 'referrals',
    id: ref.id,
    data: { referee: newUserId },
  })
  return true
}

export async function rewardReferrerOnPurchase(newUserId: string): Promise<void> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'referrals',
    where: {
      and: [
        { referee: { equals: newUserId } },
        { status: { equals: 'pending' } },
      ],
    },
    limit: 1,
  })

  const ref = result.docs[0] as any
  if (!ref) return

  const referrerId = typeof ref.referrer === 'object' ? ref.referrer.id : ref.referrer

  await awardPoints(referrerId, REFERRAL_REWARD_POINTS, 'referral')
  await payload.update({
    collection: 'referrals',
    id: ref.id,
    data: { status: 'converted', reward: REFERRAL_REWARD_POINTS },
  })
}

export async function getReferralStats(userId: string) {
  const payload = await getPayload({ config })

  const code = await getOrCreateReferralCode(userId)

  const converted = await payload.find({
    collection: 'referrals',
    where: {
      and: [
        { referrer: { equals: userId } },
        { status: { equals: 'converted' } },
      ],
    },
    limit: 0,
  })

  const pending = await payload.find({
    collection: 'referrals',
    where: {
      and: [
        { referrer: { equals: userId } },
        { status: { equals: 'pending' } },
        { referee: { exists: true } },
      ],
    },
    limit: 0,
  })

  return {
    code,
    totalReferred: converted.totalDocs + pending.totalDocs,
    converted: converted.totalDocs,
    totalPoints: converted.totalDocs * REFERRAL_REWARD_POINTS,
  }
}
