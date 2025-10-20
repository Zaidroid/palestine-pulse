/**
 * Interactive Map Component
 * 
 * Displays geographic data for Gaza and West Bank with:
 * - Base map with OpenStreetMap
 * - Marker clusters for incidents
 * - Heatmap layer for casualty density
 * - Region boundaries
 * - Interactive popups
 * - Layer controls
 */

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Skeleton } from './components/ui/skeleton';
import { Badge } from './components/ui/badge';
import { Map as MapIcon, Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// ============================================
// TYPES
// ============================================

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  casualties?: number;
  type: 'city' | 'incident' | 'infrastructure';
  description?: string;
  date?: string;
}

interface InteractiveMapProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
  showHeatmap?: boolean;
  showBoundaries?: boolean;
  height?: string;
  loading?: boolean;
  title?: string;
  description?: string;
}

// ============================================
// SAMPLE DATA (Gaza and West Bank locations)
// ============================================

const GAZA_CITIES: MapLocation[] = [
  { id: 'gaza-city', name: 'Gaza City', lat: 31.5, lng: 34.467, type: 'city', casualties: 15000 },
  { id: 'khan-younis', name: 'Khan Younis', lat: 31.341, lng: 34.306, type: 'city', casualties: 8000 },
  { id: 'rafah', name: 'Rafah', lat: 31.289, lng: 34.244, type: 'city', casualties: 6000 },
  { id: 'jabalia', name: 'Jabalia', lat: 31.531, lng: 34.483, type: 'city', casualties: 5000 },
  { id: 'deir-al-balah', name: 'Deir al-Balah', lat: 31.418, lng: 34.352, type: 'city', casualties: 3000 },
];

const WEST_BANK_CITIES: MapLocation[] = [
  { id: 'ramallah', name: 'Ramallah', lat: 31.8996, lng: 35.2042, type: 'city', casualties: 150 },
  { id: 'hebron', name: 'Hebron', lat: 31.5326, lng: 35.0998, type: 'city', casualties: 200 },
  { id: 'nablus', name: 'Nablus', lat: 32.2211, lng: 35.2544, type: 'city', casualties: 100 },
  { id: 'jenin', name: 'Jenin', lat: 32.4611, lng: 35.3031, type: 'city', casualties: 180 },
  { id: 'tulkarm', name: 'Tulkarm', lat: 32.3106, lng: 35.0278, type: 'city', casualties: 80 },
];

// Gaza boundary (approximate)
const GAZA_BOUNDARY: [number, number][] = [
  [31.585, 34.555],
  [31.585, 34.218],
  [31.213, 34.218],
  [31.213, 34.555],
  [31.585, 34.555],
];

// ============================================
// MAP CENTER CONTROLLER
// ============================================

function MapCenterController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const InteractiveMap = ({
  locations = [...GAZA_CITIES, ...WEST_BANK_CITIES],
  center = [31.5, 34.45], // Gaza center
  zoom = 9,
  showHeatmap = false,
  showBoundaries = true,
  height = '500px',
  loading = false,
  title = 'Geographic Overview',
  description = 'Interactive map showing key locations and incident data',
}: InteractiveMapProps) => {
  
  // Calculate intensity for circles based on casualties
  const getIntensityColor = (casualties: number = 0) => {
    if (casualties > 10000) return '#DC2626'; // red-600
    if (casualties > 5000) return '#EA580C'; // orange-600
    if (casualties > 1000) return '#F59E0B'; // amber-500
    if (casualties > 500) return '#EAB308'; // yellow-500
    return '#3B82F6'; // blue-500
  };

  const getIntensityRadius = (casualties: number = 0) => {
    if (casualties > 10000) return 15000;
    if (casualties > 5000) return 10000;
    if (casualties > 1000) return 5000;
    if (casualties > 500) return 3000;
    return 2000;
  };

  // Memoize map content
  const mapContent = useMemo(() => (
    <MapContainer
      center={center as L.LatLngExpression}
      zoom={zoom}
      style={{ height, width: '100%' }}
      scrollWheelZoom={true}
      className="rounded-lg"
    >
      <MapCenterController center={center} zoom={zoom} />
      
      {/* Base Map Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Gaza Boundary */}
      {showBoundaries && (
        <Polyline
          positions={GAZA_BOUNDARY}
          pathOptions={{
            color: '#DC2626',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10',
          }}
        />
      )}
      
      {/* Location Markers with Circles */}
      {locations.map((location) => (
        <div key={location.id}>
          {/* Casualty intensity circle */}
          {location.casualties && location.casualties > 0 && (
            <Circle
              center={[location.lat, location.lng] as L.LatLngExpression}
              radius={getIntensityRadius(location.casualties)}
              pathOptions={{
                fillColor: getIntensityColor(location.casualties),
                fillOpacity: 0.15,
                color: getIntensityColor(location.casualties),
                weight: 2,
                opacity: 0.4,
              }}
            />
          )}
          
          {/* Marker */}
          <Marker position={[location.lat, location.lng] as L.LatLngExpression}>
            <Popup>
              <div className="space-y-2 min-w-[200px]">
                <div className="font-bold text-lg">{location.name}</div>
                
                {location.casualties && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Casualties:</span>
                    <Badge variant="destructive">
                      {location.casualties.toLocaleString()}
                    </Badge>
                  </div>
                )}
                
                {location.type && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="outline" className="capitalize">
                      {location.type}
                    </Badge>
                  </div>
                )}
                
                {location.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {location.description}
                  </p>
                )}
                
                {location.date && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(location.date).toLocaleDateString()}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                  Coordinates: {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
                </div>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  ), [locations, center, zoom, showBoundaries, height]);

  return (
    <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{description}</span>
          {locations.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              <Layers className="h-3 w-3 mr-1" />
              {locations.length} locations
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="w-full" style={{ height }} />
        ) : (
          <>
            {mapContent}
            
            {/* Legend */}
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-sm font-medium mb-2">Casualty Intensity</div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#DC2626]" />
                  <span className="text-xs text-muted-foreground">&gt; 10,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#EA580C]" />
                  <span className="text-xs text-muted-foreground">5,000 - 10,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#F59E0B]" />
                  <span className="text-xs text-muted-foreground">1,000 - 5,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#EAB308]" />
                  <span className="text-xs text-muted-foreground">500 - 1,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                  <span className="text-xs text-muted-foreground">&lt; 500</span>
                </div>
              </div>
              
              {showBoundaries && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 border-t-2 border-dashed border-[#DC2626]" />
                    <span className="text-xs text-muted-foreground">Gaza Strip Boundary</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Click on markers for detailed information • Zoom with scroll or controls
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Export sample data for use in other components
export { GAZA_CITIES, WEST_BANK_CITIES, GAZA_BOUNDARY };
export type { MapLocation };