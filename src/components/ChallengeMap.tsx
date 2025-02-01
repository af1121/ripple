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
    google: any;
  }
}

export function ChallengeMap({ participants }: ChallengeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);

  useEffect(() => {
    const loadMap = () => {
      if (!window.google || !mapRef.current) return;

      const bounds = new window.google.maps.LatLngBounds();
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 2,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }],
          },
        ],
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

    if (window.google) {
      loadMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", loadMap);
      document.head.appendChild(script);
    }
  }, [participants]);

  return (
    <Card className="overflow-hidden">
      <div ref={mapRef} className="w-full h-[400px]" />
    </Card>
  );
}