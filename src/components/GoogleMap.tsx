import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface GoogleMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

export function GoogleMap({ center, zoom = 13 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });

      // Add a marker at the center
      new window.google.maps.Marker({
        position: center,
        map: googleMapRef.current,
        animation: window.google.maps.Animation.DROP,
      });
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
      googleMapRef.current = null;
    };
  }, [center, zoom]);

  return (
    <Card className="overflow-hidden">
      <div ref={mapRef} className="w-full h-[300px]" />
    </Card>
  );
} 