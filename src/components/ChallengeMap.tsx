import { DeckGLMap } from "./DeckGLMap";
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

export function ChallengeMap({ participants }: ChallengeMapProps) {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Global Impact Visualization</h3>
          <p className="text-sm text-muted-foreground">
            3D visualization of challenge connections across the globe
          </p>
        </div>
        <DeckGLMap participants={participants} />
      </Card>
    </div>
  );
}