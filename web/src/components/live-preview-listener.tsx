'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/** Ververst de pagina in het live-preview-paneel bij elke (auto)save vanuit de admin. */
export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  return (
    <PayloadLivePreview
      refresh={router.refresh}
      serverURL={typeof window !== 'undefined' ? window.location.origin : ''}
    />
  )
}
