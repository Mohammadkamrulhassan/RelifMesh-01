import { useOffline } from '../../hooks/useOffline'
import { useSync } from '../../hooks/useSync'
import { useEffect } from 'react'

export default function SyncStatus() {
  const isOffline = useOffline()
  const { syncing, syncStatus, sync } = useSync()

  useEffect(() => {
    if (!isOffline && syncStatus === 'idle') sync()
  }, [isOffline])

  if (isOffline) {
    return <span className="badge badge-warning">Offline</span>
  }

  if (syncing) {
    return <span className="badge badge-info">Syncing...</span>
  }

  if (syncStatus === 'error') {
    return <span className="badge badge-danger">Sync Error</span>
  }

  return <span className="badge badge-success">Online</span>
}
