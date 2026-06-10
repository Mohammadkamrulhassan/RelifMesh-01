import { useState, useCallback } from 'react'
import { post, put, get } from '../services/api'
import { getPending, removePending } from '../services/offline'

export function useSync() {
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('idle')

  const sync = useCallback(async () => {
    setSyncing(true)
    setSyncStatus('syncing')
    try {
      const pending = await getPending()
      for (let i = pending.length - 1; i >= 0; i--) {
        const op = pending[i]
        try {
          if (op.data.method === 'POST') {
            await post(op.key, op.data.body)
          } else if (op.data.method === 'PUT') {
            await put(op.key, op.data.body)
          }
          await removePending(i)
        } catch {
          break
        }
      }
      setSyncStatus('synced')
    } catch {
      setSyncStatus('error')
    } finally {
      setSyncing(false)
    }
  }, [])

  return { syncing, syncStatus, sync }
}
