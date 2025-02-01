import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface ChallengeMapProps {
  participants: {
    id: string;
    userName: string;
    location?: {
      lat: number;
      lng: number;
    };
    createdAt: string;
    nominatedBy?: string;
  }[];
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export function ChallengeMap({ participants }: ChallengeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map>(null);

  const participantsWithLocation = participants.filter((p): p is (typeof participants[0] & { location: NonNullable<typeof participants[0]['location']> }) => 
    !!p.location
  );

  useEffect(() => {
    const loadMap = () => {
      if (!window.google || !mapRef.current) return;

      const bounds = new window.google.maps.LatLngBounds();
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 2,
      });

      googleMapRef.current = map;

      // Create markers and store them in a map for line drawing
      const markerMap = new Map<string, google.maps.Marker>();

      participantsWithLocation.forEach((participant) => {
        const marker = new window.google.maps.Marker({
          position: participant.location,
          map,
          title: participant.userName,
          animation: window.google.maps.Animation.DROP,
        });

        markerMap.set(participant.id, marker);
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

      // Draw lines between connected participants
      participantsWithLocation.forEach((participant) => {
        if (participant.nominatedBy) {
          const parentMarker = markerMap.get(participant.nominatedBy);
          const childMarker = markerMap.get(participant.id);

          if (parentMarker && childMarker) {
            const lineSymbol = {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillOpacity: 1,
              scale: 3,
              strokeColor: "#f97316",
              strokeWeight: 1,
            };

            const line = new window.google.maps.Polyline({
              path: [
                parentMarker.getPosition()!,
                childMarker.getPosition()!
              ],
              geodesic: true,
              strokeColor: "#f97316",
              strokeOpacity: 0,
              icons: [{
                icon: lineSymbol,
                offset: "0",
                repeat: "20px"
              }],
            });
            line.setMap(map);

            // Animate the line
            let count = 0;
            window.setInterval(() => {
              count = (count + 1) % 200;
              const icons = line.get("icons");
              icons[0].offset = (count / 2) + "px";
              line.set("icons", icons);
            }, 20);
          }
        }
      });

      if (participantsWithLocation.length > 0) {
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
  }, [participantsWithLocation]);

  return (
    <Card className="overflow-hidden">
      <div ref={mapRef} className="w-full h-[400px]" />
    </Card>
  );
}