import { useState, useCallback } from 'react'
import { post, get } from '../services/api'
import { getPending, clearPending, removePending } from '../services/offline'

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
          await post('/sync/push', { key: op.key, data: op.data })
          await removePending(i)
        } catch {
          break
        }
      }
      const serverData = await get('/sync/pull')
      setSyncStatus('synced')
    } catch {
      setSyncStatus('error')
    } finally {
      setSyncing(false)
    }
  }, [])

  return { syncing, syncStatus, sync }
}
