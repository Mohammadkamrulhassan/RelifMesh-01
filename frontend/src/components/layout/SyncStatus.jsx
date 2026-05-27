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
    return <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded-full font-medium">Offline</span>
  }

  if (syncing) {
    return <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">Syncing...</span>
  }

  if (syncStatus === 'error') {
    return <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">Sync Error</span>
  }

  return <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">Online</span>
}
