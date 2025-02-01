import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ChallengeMap } from "@/components/ChallengeMap";
import { Network, Edge, Node, Options } from "vis-network";
import { DataSet } from "vis-data";

export interface ChainNode {
  id: string;
  userName: string;
  nominatedBy?: string;
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export function ChallengeChain({ participants }: { participants: ChainNode[] }) {
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    // Create nodes and edges from participants
    const nodes = new DataSet<Node>(
      participants.map(p => ({
        id: p.id,
        label: p.userName,
        title: `
          <div class="p-2">
            <strong>${p.userName}</strong><br/>
            Joined: ${new Date(p.createdAt).toLocaleDateString()}<br/>
            ${p.location ? `Location: ${p.location.lat.toFixed(2)}, ${p.location.lng.toFixed(2)}` : 'No location'}<br/>
            ${p.nominatedBy ? `Nominated by: Participant ${p.nominatedBy}` : 'Challenge Creator'}
          </div>
        `,
      }))
    );

    const edges = new DataSet<Edge>(
      participants
        .filter(p => p.nominatedBy)
        .map(p => ({
          id: `${p.nominatedBy}-${p.id}`,
          from: p.nominatedBy,
          to: p.id,
          arrows: "to",
        }))
    );

    const options: Options = {
      nodes: {
        shape: "circularImage",
        image: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        size: 25,
        font: {
          size: 14,
          color: "#64748b",
          face: "Inter, system-ui, sans-serif",
          align: "left",
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        color: {
          background: "#fff",
          border: "#0d9488",
          highlight: {
            background: "#fff",
            border: "#0d9488",
          },
          hover: {
            background: "#fff",
            border: "#0d9488",
          }
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 8,
          x: 0,
          y: 4
        }
      },
      edges: {
        width: 1.5,
        selectionWidth: 2,
        color: {
          color: "#e2e8f0",
          highlight: "#0d9488",
          hover: "#0d9488",
        },
        smooth: {
          enabled: true,
          type: "cubicBezier",
          roundness: 0.5,
          forceDirection: "vertical"
        },
      },
      physics: {
        enabled: false,
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed",
          nodeSpacing: 100,
          levelSeparation: 120,
          treeSpacing: 100,
          parentCentralization: true,
          blockShifting: true,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        hideEdgesOnDrag: true,
        keyboard: false,
        multiselect: false,
      },
    };

    // Create the network
    const network = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    return () => {
      network.destroy();
    };
  }, [participants]);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <ChallengeMap participants={participants} />
      </Card>
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nomination Chain</h2>
          <div 
            ref={networkRef} 
            className="w-full overflow-hidden" 
            style={{ height: "400px" }}
          />
        </div>
      </Card>
    </div>
  );
} 