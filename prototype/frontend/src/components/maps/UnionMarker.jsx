import { divIcon } from 'leaflet'
import { Marker } from 'react-leaflet'

export default function UnionMarker({ lat, lng, label, color = '#1e40af' }) {
  const icon = divIcon({
    className: 'bg-transparent',
    html: `<div style="background:${color};color:#fff;padding:4px 8px;border-radius:8px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.2)">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
  return <Marker position={[lat, lng]} icon={icon} />
}
