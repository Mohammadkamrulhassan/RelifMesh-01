import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet.heat'

/**
 * Adds a heatmap layer to a Leaflet map instance.
 * Props:
 *  - map: Leaflet map instance (required)
 *  - points: Array of { lat, lng, intensity }
 *  - options: { radius, blur, maxZoom, max, gradient, minOpacity }
 * Notes:
 *  - Uses square-root transformation on intensity to spread mid-range values
 *    and prevent all points from looking equally faint.
 *  - Default radius/blur are tuned for zoom ~12 (Feni district level).
 */
export default function HeatmapLayer({ map, points = [], options = {} }) {
  useEffect(() => {
    if (!map || points.length === 0) return

    const heatOptions = {
      radius: options.radius ?? 45,
      blur: options.blur ?? 12,
      maxZoom: options.maxZoom ?? 18,
      max: options.max ?? 1.0,
      minOpacity: options.minOpacity ?? 0.4,
      gradient: options.gradient || { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' },
    }

    // Square-root transformation spreads mid-range values across the gradient,
    // preventing all points from clustering at the low end of the spectrum.
    const intensities = points.map(p => {
      const v = p.intensity || 0
      return Math.sqrt(v)
    })
    const maxIntensity = Math.max(...intensities, 1)
    const heatData = points.map((p, i) => [p.lat, p.lng, intensities[i] / maxIntensity])

    const heatLayer = L.heatLayer(heatData, heatOptions).addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, points, options])

  return null
}
