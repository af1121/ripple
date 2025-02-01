import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChallengeMap } from "@/components/ChallengeMap";
import { Participant } from "@/types";

interface ChainNode {
  id: string;
  userName: string;
  nominatedBy?: string;
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface ChallengeChainProps {
  participants: ChainNode[];
}

export function ChallengeChain({ participants }: ChallengeChainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // Draw nodes
    const nodeRadius = 20;
    const nodeColor = "#f97316"; // Orange color

    participants.forEach((participant, index) => {
      const x = canvas.width / 2;
      const y = 50 + (index * 80);

      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Draw connection line to nominator
      if (participant.nominatedBy) {
        const nominatorIndex = participants.findIndex(p => p.id === participant.nominatedBy);
        if (nominatorIndex !== -1) {
          ctx.beginPath();
          ctx.moveTo(x, y - nodeRadius);
          ctx.lineTo(x, 50 + (nominatorIndex * 80) + nodeRadius);
          ctx.stroke();
        }
      }
    });
  }, [participants]);

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="tree">
        <TabsList className="w-full">
          <TabsTrigger value="tree" className="flex-1">Tree view</TabsTrigger>
          <TabsTrigger value="map" className="flex-1">Map view</TabsTrigger>
        </TabsList>
        <TabsContent value="tree" className="p-6">
          <canvas 
            ref={canvasRef} 
            className="w-full"
            style={{ height: "400px" }}
          />
        </TabsContent>
        <TabsContent value="map">
          <ChallengeMap 
            participants={participants.filter((p): p is Participant => !!p.location) as Participant[]} 
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
} 