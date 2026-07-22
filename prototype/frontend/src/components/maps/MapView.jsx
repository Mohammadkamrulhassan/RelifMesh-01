import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const FENI_CENTER = [23.0141, 91.3961]
const FENI_ZOOM = 12

export default function MapView({ markers = [], center = FENI_CENTER, zoom = FENI_ZOOM, className = '', onReady }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (mapInstance.current) return
    mapInstance.current = L.map(mapRef.current).setView(center, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current)
    if (onReady) onReady(mapInstance.current)
    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return
    const layer = L.layerGroup().addTo(mapInstance.current)
    const latLngs = []
    markers.forEach(m => {
      const ll = L.latLng(m.lat, m.lng)
      latLngs.push(ll)
      L.marker(ll).addTo(layer).bindPopup(m.popup || '')
    })
    // Auto-fit bounds to markers when data loads
    if (latLngs.length >= 2) {
      mapInstance.current.fitBounds(latLngs, { padding: [40, 40], maxZoom: 14 })
    } else if (latLngs.length === 1) {
      mapInstance.current.setView(latLngs[0], FENI_ZOOM)
    } else {
      mapInstance.current.setView(center, zoom)
    }
    return () => layer.clearLayers()
  }, [markers])

  return <div ref={mapRef} className={`h-80 rounded-xl border ${className}`} />
}
