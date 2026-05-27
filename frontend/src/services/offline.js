import localforage from 'localforage'

const store = localforage.createInstance({ name: 'relifmesh_offline' })

export async function savePending(key, data) {
  const pending = await store.getItem('pendingOps') || []
  pending.push({ key, data, timestamp: Date.now() })
  await store.setItem('pendingOps', pending)
}

export async function getPending() {
  return (await store.getItem('pendingOps')) || []
}

export async function clearPending() {
  await store.setItem('pendingOps', [])
}

export async function removePending(index) {
  const pending = await getPending()
  pending.splice(index, 1)
  await store.setItem('pendingOps', pending)
}

export async function cacheData(key, data) {
  await store.setItem(key, { data, cachedAt: Date.now() })
}

export async function getCached(key) {
  const entry = await store.getItem(key)
  return entry ? entry.data : null
}

export async function clearCache() {
  await store.clear()
}
