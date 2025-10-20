import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  description?: string;
  type?: 'critical' | 'high' | 'medium' | 'low';
  data?: Record<string, any>;
}

export interface MapRegion {
  id: string;
  center: [number, number];
  radius: number;
  color?: string;
  fillOpacity?: number;
  value?: number;
  label?: string;
}

interface MapVisualizationProps {
  title?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  regions?: MapRegion[];
  height?: number;
  showControls?: boolean;
  loading?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  onRegionClick?: (region: MapRegion) => void;
  className?: string;
}

// Map controls component
const MapControls = () => {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        size="icon"
        variant="secondary"
        onClick={() => map.zoomIn()}
        className="shadow-lg"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => map.zoomOut()}
        className="shadow-lg"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => map.setView(map.getCenter(), map.getZoom())}
        className="shadow-lg"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const MapVisualization = ({
  title = "Interactive Map",
  center = [31.5, 34.8], // Palestine
  zoom = 8,
  markers = [],
  regions = [],
  height = 500,
  showControls = true,
  loading = false,
  onMarkerClick,
  onRegionClick,
  className
}: MapVisualizationProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getMarkerColor = (type?: string) => {
    switch (type) {
      case 'critical':
        return 'hsl(var(--destructive))';
      case 'high':
        return 'hsl(var(--warning))';
      case 'medium':
        return 'hsl(var(--primary))';
      case 'low':
        return 'hsl(var(--secondary))';
      default:
        return 'hsl(var(--primary))';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        <Card>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>
            <div 
              className="flex items-center justify-center bg-muted/20 rounded-lg"
              style={{ height: `${height}px` }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-0">
          <div 
            className="relative rounded-b-lg overflow-hidden"
            style={{ height: `${height}px` }}
          >
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
              whenReady={() => setIsLoaded(true)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Markers */}
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  eventHandlers={{
                    click: () => onMarkerClick?.(marker)
                  }}
                >
                  <Popup>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{marker.title}</h4>
                      {marker.description && (
                        <p className="text-sm text-muted-foreground">
                          {marker.description}
                        </p>
                      )}
                      {marker.data && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(marker.data).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs gap-4">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Regions (circles) */}
              {regions.map((region) => (
                <Circle
                  key={region.id}
                  center={region.center}
                  radius={region.radius}
                  pathOptions={{
                    color: region.color || 'hsl(var(--primary))',
                    fillColor: region.color || 'hsl(var(--primary))',
                    fillOpacity: region.fillOpacity || 0.3
                  }}
                  eventHandlers={{
                    click: () => onRegionClick?.(region)
                  }}
                >
                  {region.label && (
                    <Popup>
                      <div className="space-y-1">
                        <h4 className="font-semibold">{region.label}</h4>
                        {region.value !== undefined && (
                          <p className="text-sm">
                            Value: <span className="font-bold">{region.value}</span>
                          </p>
                        )}
                      </div>
                    </Popup>
                  )}
                </Circle>
              ))}

              {showControls && <MapControls />}
            </MapContainer>

            {/* Legend */}
            {(markers.length > 0 || regions.length > 0) && (
              <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur p-3 rounded-lg shadow-lg border">
                <h5 className="text-xs font-semibold mb-2">Legend</h5>
                <div className="space-y-1 text-xs">
                  {['critical', 'high', 'medium', 'low'].map(type => {
                    const count = markers.filter(m => m.type === type).length;
                    if (count === 0) return null;
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getMarkerColor(type) }}
                        />
                        <span className="capitalize">{type}: {count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};