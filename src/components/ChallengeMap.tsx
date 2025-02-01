import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface Participant {
  id: string;
  userName: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

interface ChallengeMapProps {
  participants: Participant[];
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export function ChallengeMap({ participants }: ChallengeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map>(null);

  useEffect(() => {
    const loadMap = () => {
      if (!window.google || !mapRef.current) return;

      const bounds = new window.google.maps.LatLngBounds();
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 2,
      });

      googleMapRef.current = map;

      participants.forEach((participant) => {
        const marker = new window.google.maps.Marker({
          position: participant.location,
          map,
          title: participant.userName,
          animation: window.google.maps.Animation.DROP,
        });

        bounds.extend(participant.location);

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${participant.userName}</h3>
              <p class="text-sm text-gray-600">
                Joined ${new Date(participant.createdAt).toLocaleDateString()}
              </p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });

      if (participants.length > 0) {
        map.fitBounds(bounds);
      }
    };

    // Only attempt to load the map if the container exists
    if (mapRef.current) {
      if (window.google) {
        loadMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = loadMap;
        document.head.appendChild(script);
      }
    }
  }, [participants]);

  return (
    <Card className="overflow-hidden">
      <div ref={mapRef} className="w-full h-[400px]" />
    </Card>
  );
}