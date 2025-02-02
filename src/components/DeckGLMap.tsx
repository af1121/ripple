import { relative } from 'path';
import { useMemo } from 'react';
import Globe from 'react-globe.gl';

interface DeckGLMapProps {
  participants: {
    id: string;
    userName: string;
    location?: {
      lat: number;
      lng: number;
    };
    nominatedBy?: string;
  }[];
}

export function DeckGLMap({ participants }: DeckGLMapProps) {
  const arcsData = useMemo(() => {
    const participantsWithLocation = participants.filter(
      (p): p is (typeof participants[0] & { location: NonNullable<typeof participants[0]['location']> }) => 
        !!p.location
    );

    return participantsWithLocation
      .filter(p => p.nominatedBy)
      .map(p => {
        const parent = participantsWithLocation.find(
          parent => parent.id === p.nominatedBy
        );
        if (!parent?.location) return null;

        return {
          startLat: parent.location.lat,
          startLng: parent.location.lng,
          endLat: p.location.lat,
          endLng: p.location.lng,
          color: '#0d9488'
        };
      })
      .filter(Boolean);
  }, [participants]);

  return (
    <div className="h-[300px] md:h-[500px] w-full relative">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        arcsData={arcsData}
        arcColor={'color'}
        arcDashLength={0.4}
        arcDashGap={0}
        arcDashAnimateTime={6000}
        arcStroke={0.45}
        backgroundColor="rgb(2, 6, 26)"
        width={window.innerWidth < 768 ? window.innerWidth - 32 : 800}
        height={window.innerWidth < 768 ? 300 : 500}
      />
    </div>
  );
} 