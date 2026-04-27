'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/app/lib/tracking'

interface Props {
  event: string
  entityId?: string
  entityType?: string
  metadata?: Record<string, unknown>
}

export default function TrackEvent({ event, entityId, entityType, metadata }: Props) {
  useEffect(() => {
    trackEvent(event, entityId, entityType, metadata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
